import type { HTMLAttributes, PropsWithChildren } from 'react';

import { cn } from '../../lib/utils';

export function Badge({ className, children, ...props }: PropsWithChildren<HTMLAttributes<HTMLSpanElement>>) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full bg-ink/6 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-ink/70',
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
