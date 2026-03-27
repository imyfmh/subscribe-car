import { useEffect, type PropsWithChildren, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

import { cn } from '../../lib/utils';
import { Button } from './button';
import { Card, CardDescription, CardTitle } from './card';

interface DialogProps extends PropsWithChildren {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  footer?: ReactNode;
  className?: string;
}

export function Dialog({
  open,
  onClose,
  title,
  description,
  footer,
  className,
  children,
}: DialogProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
      <button
        aria-label="关闭弹窗"
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <Card className={cn('relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto p-6', className)}>
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <CardTitle>{title}</CardTitle>
            {description ? <CardDescription>{description}</CardDescription> : null}
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            关闭
          </Button>
        </div>
        <div>{children}</div>
        {footer ? <div className="mt-6">{footer}</div> : null}
      </Card>
    </div>,
    document.body,
  );
}
