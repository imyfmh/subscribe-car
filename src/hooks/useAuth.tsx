import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';

import { mockProfiles } from '../lib/mock-data';
import { upsertProfile } from '../lib/repository';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import type { AuthUser } from '../lib/types';

const DEMO_SESSION_KEY = 'subscribe-car:demo-session';

type AuthMode = 'supabase' | 'demo';

interface AuthContextValue {
  user: AuthUser | null;
  mode: AuthMode;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function createDemoUser(): AuthUser {
  const profile = mockProfiles[0];
  return {
    id: profile.id,
    email: 'demo@subscribe.car',
    nickname: profile.nickname,
    avatarUrl: profile.avatar_url,
    contact: profile.contact,
    rating: profile.rating,
    isDemo: true,
  };
}

function mapSupabaseUser(user: {
  id: string;
  email?: string | null;
  user_metadata?: Record<string, unknown>;
}): AuthUser {
  const metadata = user.user_metadata ?? {};
  const nickname =
    (typeof metadata.full_name === 'string' && metadata.full_name) ||
    (typeof metadata.name === 'string' && metadata.name) ||
    user.email?.split('@')[0] ||
    '新用户';

  const avatarUrl =
    typeof metadata.avatar_url === 'string'
      ? metadata.avatar_url
      : typeof metadata.picture === 'string'
        ? metadata.picture
        : null;

  return {
    id: user.id,
    email: user.email ?? null,
    nickname,
    avatarUrl,
    contact: user.email ?? '待补充',
    rating: 5,
  };
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      const rawSession = window.localStorage.getItem(DEMO_SESSION_KEY);
      if (rawSession) {
        setUser(JSON.parse(rawSession) as AuthUser);
      }
      setLoading(false);
      return;
    }

    const client = supabase;
    let isMounted = true;

    async function hydrateSession() {
      const {
        data: { session },
      } = await client.auth.getSession();

      if (!isMounted) {
        return;
      }

      if (session?.user) {
        const nextUser = mapSupabaseUser(session.user);
        await upsertProfile(nextUser);
        setUser(nextUser);
      } else {
        setUser(null);
      }

      setLoading(false);
    }

    void hydrateSession();

    const { data } = client.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        setUser(null);
        return;
      }

      const nextUser = mapSupabaseUser(session.user);
      void upsertProfile(nextUser);
      setUser(nextUser);
    });

    return () => {
      isMounted = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) {
      const demoUser = createDemoUser();
      window.localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(demoUser));
      setUser(demoUser);
      return;
    }

    const client = supabase;
    const redirectTo = new URL(import.meta.env.BASE_URL, window.location.origin).toString();
    const { error } = await client.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo },
    });

    if (error) {
      throw new Error(error.message);
    }
  }, []);

  const signOut = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) {
      window.localStorage.removeItem(DEMO_SESSION_KEY);
      setUser(null);
      return;
    }

    const client = supabase;
    const { error } = await client.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }

    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      mode: isSupabaseConfigured ? 'supabase' : 'demo',
      loading,
      signInWithGoogle,
      signOut,
    }),
    [loading, signInWithGoogle, signOut, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider.');
  }

  return context;
}
