import { forwardRef, type TextareaHTMLAttributes } from 'react';

import { cn } from '../../lib/utils';

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      'min-h-32 w-full rounded-[24px] border border-ink/10 bg-white px-4 py-3 text-sm leading-6 text-ink outline-none transition placeholder:text-ink/35 focus:border-lagoon focus:ring-4 focus:ring-lagoon/10',
      className,
    )}
    {...props}
  />
));

Textarea.displayName = 'Textarea';
