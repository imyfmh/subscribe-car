import { useEffect, useMemo, useRef, useState } from 'react';

import { cn } from '../../lib/utils';

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function Select({
  className,
  value,
  onChange,
  options,
  placeholder = '请选择',
  disabled = false,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const selectedOption = useMemo(
    () => options.find((option) => option.value === value) ?? null,
    [options, value],
  );

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    window.addEventListener('mousedown', handlePointerDown);
    return () => {
      window.removeEventListener('mousedown', handlePointerDown);
    };
  }, []);

  return (
    <div ref={rootRef} className={cn('relative', className)}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
        className={cn(
          'flex h-12 w-full items-center justify-between rounded-2xl border border-ink/10 bg-white px-4 text-left text-sm text-ink outline-none transition focus:border-lagoon focus:ring-4 focus:ring-lagoon/10 disabled:cursor-not-allowed disabled:bg-[#f3efe7] disabled:text-ink/40',
          open && 'border-lagoon ring-4 ring-lagoon/10',
        )}
      >
        <span className={selectedOption ? 'text-ink' : 'text-ink/35'}>
          {selectedOption?.label ?? placeholder}
        </span>
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          className={cn('h-4 w-4 text-ink/45 transition', open && 'rotate-180')}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="M5 7.5 10 12.5 15 7.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && !disabled ? (
        <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-[22px] border border-ink/10 bg-white p-2 shadow-float">
          {options.map((option) => {
            const active = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={cn(
                  'flex w-full items-start justify-between rounded-2xl px-3 py-3 text-left transition',
                  active ? 'bg-ink text-white' : 'text-ink hover:bg-mist',
                )}
              >
                <span>
                  <span className="block text-sm font-semibold">{option.label}</span>
                  {option.description ? (
                    <span className={cn('mt-1 block text-xs', active ? 'text-white/70' : 'text-ink/55')}>
                      {option.description}
                    </span>
                  ) : null}
                </span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
