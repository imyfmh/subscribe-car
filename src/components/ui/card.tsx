import type { HTMLAttributes, PropsWithChildren } from 'react';

import { cn } from '../../lib/utils';

export function Card({ className, children, ...props }: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return (
    <div
      className={cn(
        'rounded-[28px] border border-white/60 bg-white/80 p-6 shadow-float backdrop-blur',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({
  className,
  children,
  ...props
}: PropsWithChildren<HTMLAttributes<HTMLHeadingElement>>) {
  return (
    <h3 className={cn('font-display text-xl font-semibold text-ink', className)} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({
  className,
  children,
  ...props
}: PropsWithChildren<HTMLAttributes<HTMLParagraphElement>>) {
  return (
    <p className={cn('text-sm leading-6 text-ink/70', className)} {...props}>
      {children}
    </p>
  );
}
