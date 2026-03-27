import type { SelectHTMLAttributes } from 'react';

import { cn } from '../../lib/utils';

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        'h-12 w-full rounded-2xl border border-ink/10 bg-white px-4 text-sm text-ink outline-none transition focus:border-lagoon focus:ring-4 focus:ring-lagoon/10',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}
