import React, { useState } from 'react';
import { useOutsideClick } from '../internal/useOutsideClick';

export interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  'aria-label'?: string;
}

interface ChevronIconProps {
  open: boolean;
  color: string;
}

const ChevronIcon: React.FC<ChevronIconProps> = ({ open, color }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path
      d={open ? 'M4 8.5L7 5.5l3 3' : 'M4 5.5L7 8.5l3-3'}
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** Menu déroulant simple à sélection unique — défaut/hover/ouvert/désactivé. */
export const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  disabled = false,
  'aria-label': ariaLabel,
}) => {
  const [isOpen, setOpen] = useState(false);
  const ref = useOutsideClick<HTMLDivElement>(() => setOpen(false), isOpen);
  const current = options.find((option) => option.value === value);
  const chevronColor = disabled ? '#C9C7BE' : isOpen ? '#0A6B4E' : '#6B7069';

  return (
    <div ref={ref} className="relative inline-block w-[210px]">
      <button
        type="button"
        disabled={disabled}
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setOpen((open) => !open)}
        className={[
          'flex w-full cursor-pointer items-center justify-between rounded-xl border px-[14px] py-[11px] text-left text-[13.5px] font-semibold transition',
          disabled
            ? 'cursor-not-allowed border-line-soft bg-cream text-ink-disabled'
            : isOpen
              ? 'border-[1.5px] border-primary bg-card text-ink'
              : 'border-line bg-card text-ink hover:border-[#D8D5CC] hover:bg-cream-50',
        ].join(' ')}
      >
        <span>{current?.label ?? ''}</span>
        <ChevronIcon open={isOpen} color={chevronColor} />
      </button>
      {isOpen && (
        <div
          role="listbox"
          className="rounded-tile absolute top-[48px] right-0 left-0 z-10 border border-line bg-card p-1.5 shadow-[0_18px_40px_-18px_rgba(0,0,0,.35)]"
        >
          {options.map((option) => {
            const active = option.value === value;
            return (
              <div
                key={option.value}
                role="option"
                aria-selected={active}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={[
                  'flex cursor-pointer items-center justify-between rounded-lg px-[11px] py-[9px] text-[13px] font-semibold',
                  active ? 'bg-primary-soft text-primary' : 'text-ink hover:bg-cream-50',
                ].join(' ')}
              >
                {option.label}
                {active && (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path
                      d="M3 7l3 3 5-6"
                      stroke="#0A6B4E"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
