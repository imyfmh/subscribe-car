export type Region = 'US' | 'TR' | 'CN';

export type ProductType = 'apple_one' | 'music' | 'icloud';

export type Currency = 'USD' | 'TRY' | 'CNY';

export type ListingStatus = 'active' | 'closed';

export interface Profile {
  id: string;
  nickname: string;
  avatar_url: string | null;
  contact: string;
  rating: number;
  created_at: string;
}

export interface Listing {
  id: string;
  user_id: string;
  region: Region;
  product_type: ProductType;
  price: number;
  currency: Currency;
  total_slots: number;
  available_slots: number;
  description: string;
  contact: string;
  status: ListingStatus;
  created_at: string;
  profile?: Profile | null;
}

export interface Comment {
  id: string;
  listing_id: string;
  user_id: string;
  content: string;
  created_at: string;
  profile?: Profile | null;
}

export interface Report {
  id: string;
  listing_id: string;
  reason: string;
  created_at: string;
}

export interface ListingFilters {
  region?: Region | 'ALL';
  productType?: ProductType | 'ALL';
  search?: string;
  status?: ListingStatus | 'ALL';
}

export interface ListingPayload {
  region: Region;
  product_type: ProductType;
  price: number;
  currency: Currency;
  total_slots: number;
  available_slots: number;
  description: string;
  contact: string;
}

export interface ReportPayload {
  listing_id: string;
  reason: string;
}

export interface AuthUser {
  id: string;
  email: string | null;
  nickname: string;
  avatarUrl: string | null;
  contact: string;
  rating: number;
  isDemo?: boolean;
}
