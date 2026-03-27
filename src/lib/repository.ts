import { BLACKLIST_WORDS, PRODUCTS, PUBLISH_INTERVAL_MS, REGIONS } from './constants';
import { mockComments, mockListings, mockProfiles, mockReports } from './mock-data';
import { isSupabaseConfigured, supabase } from './supabase';
import type {
  AuthUser,
  Comment,
  Listing,
  ListingFilters,
  ListingPayload,
  Profile,
  Report,
  ReportPayload,
} from './types';
import { createId, normalizeSearchText } from './utils';

const LOCAL_KEYS = {
  profiles: 'subscribe-car:profiles',
  listings: 'subscribe-car:listings',
  comments: 'subscribe-car:comments',
  reports: 'subscribe-car:reports',
  lastPublishPrefix: 'subscribe-car:last-publish:',
};

function getLocalStorage() {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage;
}

function seedLocalCollection<T>(key: string, initialValue: T) {
  const storage = getLocalStorage();
  if (!storage) {
    return initialValue;
  }

  const rawValue = storage.getItem(key);
  if (!rawValue) {
    storage.setItem(key, JSON.stringify(initialValue));
    return initialValue;
  }

  try {
    return JSON.parse(rawValue) as T;
  } catch {
    storage.setItem(key, JSON.stringify(initialValue));
    return initialValue;
  }
}

function readLocalDb() {
  return {
    profiles: seedLocalCollection<Profile[]>(LOCAL_KEYS.profiles, mockProfiles),
    listings: seedLocalCollection<Listing[]>(LOCAL_KEYS.listings, mockListings),
    comments: seedLocalCollection<Comment[]>(LOCAL_KEYS.comments, mockComments),
    reports: seedLocalCollection<Report[]>(LOCAL_KEYS.reports, mockReports),
  };
}

function writeLocalCollection<T>(key: string, value: T) {
  const storage = getLocalStorage();
  if (!storage) {
    return;
  }

  storage.setItem(key, JSON.stringify(value));
}

function attachListingProfiles(listings: Listing[], profiles: Profile[]) {
  return listings.map((listing) => ({
    ...listing,
    profile: profiles.find((profile) => profile.id === listing.user_id) ?? null,
  }));
}

function attachCommentProfiles(comments: Comment[], profiles: Profile[]) {
  return comments.map((comment) => ({
    ...comment,
    profile: profiles.find((profile) => profile.id === comment.user_id) ?? null,
  }));
}

function applyFilters(listings: Listing[], filters: ListingFilters = {}) {
  const search = normalizeSearchText(filters.search ?? '');

  return listings.filter((listing) => {
    if (filters.region && filters.region !== 'ALL' && listing.region !== filters.region) {
      return false;
    }

    if (
      filters.productType &&
      filters.productType !== 'ALL' &&
      listing.product_type !== filters.productType
    ) {
      return false;
    }

    if (filters.status && filters.status !== 'ALL' && listing.status !== filters.status) {
      return false;
    }

    if (search) {
      const haystack = normalizeSearchText(
        [listing.description, listing.contact, listing.profile?.nickname ?? ''].join(' '),
      );
      return haystack.includes(search);
    }

    return true;
  });
}

function assertListingPayload(payload: ListingPayload) {
  if (!REGIONS.some((item) => item.value === payload.region)) {
    throw new Error('区域无效，请使用预设选项。');
  }

  if (!PRODUCTS.some((item) => item.value === payload.product_type)) {
    throw new Error('产品类型无效，请使用预设选项。');
  }

  if (!Number.isFinite(payload.price) || payload.price <= 0) {
    throw new Error('价格必须是大于 0 的数字。');
  }

  if (!Number.isInteger(payload.total_slots) || payload.total_slots < 2 || payload.total_slots > 6) {
    throw new Error('总人数必须是 2 到 6 之间的整数。');
  }

  if (
    !Number.isInteger(payload.available_slots) ||
    payload.available_slots < 0 ||
    payload.available_slots > payload.total_slots
  ) {
    throw new Error('剩余人数必须是 0 到总人数之间的整数。');
  }

  if (payload.description.trim().length < 12 || payload.description.trim().length > 280) {
    throw new Error('描述长度需要在 12 到 280 个字符之间。');
  }

  if (payload.contact.trim().length < 2) {
    throw new Error('请填写可联系到你的方式。');
  }

  const blockedWord = BLACKLIST_WORDS.find((word) => payload.description.includes(word));
  if (blockedWord) {
    throw new Error(`描述包含敏感词“${blockedWord}”，请修改后再发布。`);
  }
}

function getLastPublishKey(userId: string) {
  return `${LOCAL_KEYS.lastPublishPrefix}${userId}`;
}

function assertLocalPublishInterval(userId: string) {
  const storage = getLocalStorage();
  if (!storage) {
    return;
  }

  const key = getLastPublishKey(userId);
  const lastPublish = Number(storage.getItem(key) ?? '0');

  if (Date.now() - lastPublish < PUBLISH_INTERVAL_MS) {
    throw new Error('发布过于频繁，请等待 1 分钟后再试。');
  }

  storage.setItem(key, String(Date.now()));
}

async function assertSupabasePublishInterval(userId: string) {
  if (!supabase) {
    return;
  }

  const { data, error } = await supabase
    .from('listings')
    .select('created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (data?.created_at && Date.now() - new Date(data.created_at).getTime() < PUBLISH_INTERVAL_MS) {
    throw new Error('发布过于频繁，请等待 1 分钟后再试。');
  }
}

function toProfile(user: AuthUser): Profile {
  return {
    id: user.id,
    nickname: user.nickname,
    avatar_url: user.avatarUrl,
    contact: user.contact,
    rating: user.rating,
    created_at: new Date().toISOString(),
  };
}

export async function upsertProfile(user: AuthUser) {
  const profile = toProfile(user);

  if (!isSupabaseConfigured || !supabase) {
    const db = readLocalDb();
    const nextProfiles = [...db.profiles.filter((item) => item.id !== user.id), profile];
    writeLocalCollection(LOCAL_KEYS.profiles, nextProfiles);
    return profile;
  }

  const { error } = await supabase.from('profiles').upsert(profile, { onConflict: 'id' });
  if (error) {
    throw new Error(error.message);
  }

  return profile;
}

export async function fetchListings(filters: ListingFilters = {}) {
  if (!isSupabaseConfigured || !supabase) {
    const db = readLocalDb();
    const listings = attachListingProfiles(db.listings, db.profiles).sort(
      (left, right) => +new Date(right.created_at) - +new Date(left.created_at),
    );
    return applyFilters(listings, filters);
  }

  let query = supabase.from('listings').select('*').order('created_at', { ascending: false });

  if (filters.region && filters.region !== 'ALL') {
    query = query.eq('region', filters.region);
  }

  if (filters.productType && filters.productType !== 'ALL') {
    query = query.eq('product_type', filters.productType);
  }

  if (filters.status && filters.status !== 'ALL') {
    query = query.eq('status', filters.status);
  }

  const { data, error } = await query;
  if (error) {
    throw new Error(error.message);
  }

  const listings = (data ?? []) as Listing[];
  const userIds = Array.from(new Set(listings.map((listing) => listing.user_id)));
  const { data: profilesData, error: profilesError } = userIds.length
    ? await supabase.from('profiles').select('*').in('id', userIds)
    : { data: [], error: null };

  if (profilesError) {
    throw new Error(profilesError.message);
  }

  return applyFilters(attachListingProfiles(listings, (profilesData ?? []) as Profile[]), filters);
}

export async function fetchListingById(listingId: string) {
  const listings = await fetchListings({ status: 'ALL' });
  return listings.find((listing) => listing.id === listingId) ?? null;
}

export async function fetchMyListings(userId: string) {
  const listings = await fetchListings({ status: 'ALL' });
  return listings.filter((listing) => listing.user_id === userId);
}

export async function fetchComments(listingId: string) {
  if (!isSupabaseConfigured || !supabase) {
    const db = readLocalDb();
    return attachCommentProfiles(
      db.comments
        .filter((comment) => comment.listing_id === listingId)
        .sort((left, right) => +new Date(right.created_at) - +new Date(left.created_at)),
      db.profiles,
    );
  }

  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('listing_id', listingId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const comments = (data ?? []) as Comment[];
  const userIds = Array.from(new Set(comments.map((comment) => comment.user_id)));
  const { data: profilesData, error: profilesError } = userIds.length
    ? await supabase.from('profiles').select('*').in('id', userIds)
    : { data: [], error: null };

  if (profilesError) {
    throw new Error(profilesError.message);
  }

  return attachCommentProfiles(comments, (profilesData ?? []) as Profile[]);
}

export async function createListing(payload: ListingPayload, user: AuthUser) {
  assertListingPayload(payload);

  if (!isSupabaseConfigured || !supabase) {
    assertLocalPublishInterval(user.id);
    const db = readLocalDb();
    const nextListing: Listing = {
      id: createId('listing'),
      user_id: user.id,
      created_at: new Date().toISOString(),
      status: payload.available_slots === 0 ? 'closed' : 'active',
      ...payload,
    };

    const nextListings = [nextListing, ...db.listings];
    writeLocalCollection(LOCAL_KEYS.listings, nextListings);
    await upsertProfile(user);
    return { ...nextListing, profile: toProfile(user) };
  }

  await assertSupabasePublishInterval(user.id);
  await upsertProfile(user);

  const { data, error } = await supabase
    .from('listings')
    .insert({
      ...payload,
      user_id: user.id,
      status: payload.available_slots === 0 ? 'closed' : 'active',
    })
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return {
    ...(data as Listing),
    profile: toProfile(user),
  };
}

export async function updateListing(listingId: string, payload: ListingPayload, userId: string) {
  assertListingPayload(payload);

  if (!isSupabaseConfigured || !supabase) {
    const db = readLocalDb();
    const target = db.listings.find((listing) => listing.id === listingId);

    if (!target || target.user_id !== userId) {
      throw new Error('只能编辑自己的发布。');
    }

    const nextListings = db.listings.map((listing) =>
      listing.id === listingId
        ? {
            ...listing,
            ...payload,
            status: payload.available_slots === 0 ? 'closed' : 'active',
          }
        : listing,
    );

    writeLocalCollection(LOCAL_KEYS.listings, nextListings);
    return nextListings.find((listing) => listing.id === listingId) ?? null;
  }

  const { data, error } = await supabase
    .from('listings')
    .update({
      ...payload,
      status: payload.available_slots === 0 ? 'closed' : 'active',
    })
    .eq('id', listingId)
    .eq('user_id', userId)
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Listing;
}

export async function deleteListing(listingId: string, userId: string) {
  if (!isSupabaseConfigured || !supabase) {
    const db = readLocalDb();
    const nextListings = db.listings.filter(
      (listing) => !(listing.id === listingId && listing.user_id === userId),
    );

    writeLocalCollection(LOCAL_KEYS.listings, nextListings);
    return;
  }

  const { error } = await supabase.from('listings').delete().eq('id', listingId).eq('user_id', userId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function createReport(payload: ReportPayload) {
  if (payload.reason.trim().length < 6) {
    throw new Error('举报原因至少需要 6 个字符。');
  }

  if (!isSupabaseConfigured || !supabase) {
    const db = readLocalDb();
    const nextReport: Report = {
      id: createId('report'),
      listing_id: payload.listing_id,
      reason: payload.reason.trim(),
      created_at: new Date().toISOString(),
    };

    writeLocalCollection(LOCAL_KEYS.reports, [nextReport, ...db.reports]);
    return nextReport;
  }

  const { data, error } = await supabase.from('reports').insert(payload).select('*').single();
  if (error) {
    throw new Error(error.message);
  }

  return data as Report;
}
