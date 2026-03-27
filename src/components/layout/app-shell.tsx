import type { ReactNode } from 'react';
import { Link, NavLink } from 'react-router-dom';

import { APP_NAME } from '../../lib/constants';
import { getAvatarFallback, cn } from '../../lib/utils';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/button';

const navItems = [
  { to: '/', label: '首页' },
  { to: '/publish', label: '发布拼车' },
  { to: '/my-listings', label: '我的发布' },
];

export function AppShell({ children }: { children: ReactNode }) {
  const { user, signInWithGoogle, signOut, mode } = useAuth();

  return (
    <div className="relative min-h-screen overflow-hidden bg-aura text-ink">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_top,_rgba(242,188,75,0.25),transparent_45%)]" />
      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-4 pb-12 pt-4 sm:px-6 lg:px-8">
        <header className="sticky top-4 z-40 rounded-full border border-white/60 bg-white/80 px-4 py-3 shadow-float backdrop-blur">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <Link to="/" className="font-display text-xl font-bold tracking-tight">
                {APP_NAME}
              </Link>
              <span className="rounded-full bg-peach/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-peach">
                MVP
              </span>
            </div>
            <nav className="flex flex-wrap items-center gap-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    cn(
                      'rounded-full px-4 py-2 text-sm font-medium transition',
                      isActive ? 'bg-ink text-white' : 'text-ink/70 hover:bg-mist',
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <div className="flex items-center justify-between gap-3 lg:justify-end">
              {mode === 'demo' ? (
                <span className="rounded-full bg-gold/20 px-3 py-1 text-xs font-semibold text-ink/70">
                  Demo 模式
                </span>
              ) : null}
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="hidden text-right sm:block">
                    <div className="text-sm font-semibold">{user.nickname}</div>
                    <div className="text-xs text-ink/60">{user.contact}</div>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-lagoon text-sm font-bold text-white">
                    {getAvatarFallback(user.nickname)}
                  </div>
                  <Button variant="secondary" size="sm" onClick={() => void signOut()}>
                    退出
                  </Button>
                </div>
              ) : (
                <Button size="sm" onClick={() => void signInWithGoogle()}>
                  Google 登录
                </Button>
              )}
            </div>
          </div>
        </header>
        <main className="flex-1 pt-8">{children}</main>
        <footer className="mt-12 border-t border-ink/10 py-6 text-sm text-ink/60">
          基于 React、Tailwind、Supabase 构建，可部署至 GitHub Pages。
        </footer>
      </div>
    </div>
  );
}
