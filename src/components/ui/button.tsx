import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

import { cn } from '../../lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-ink text-white hover:-translate-y-0.5 hover:bg-[#0f1825]',
  secondary: 'bg-white text-ink ring-1 ring-ink/10 hover:-translate-y-0.5 hover:bg-mist',
  ghost: 'bg-transparent text-ink hover:bg-white/70',
  danger: 'bg-[#b9382a] text-white hover:-translate-y-0.5 hover:bg-[#992d21]',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-10 px-4 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-6 text-base',
};

export function Button({
  className,
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  ...props
}: PropsWithChildren<ButtonProps>) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-60',
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
