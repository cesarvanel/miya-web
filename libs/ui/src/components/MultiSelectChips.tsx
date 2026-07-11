import React, { useState } from 'react';
import { useOutsideClick } from '../internal/useOutsideClick';

export interface MultiSelectOption {
  value: string;
  label: string;
}

interface MultiSelectChipsProps {
  options: MultiSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

/** Multi-select à chips — valeurs sélectionnées en chips supprimables + menu à cases. */
export const MultiSelectChips: React.FC<MultiSelectChipsProps> = ({
  options,
  value,
  onChange,
  placeholder = '+ ajouter…',
  disabled = false,
}) => {
  const [isOpen, setOpen] = useState(false);
  const ref = useOutsideClick<HTMLDivElement>(() => setOpen(false), isOpen);
  const selected = options.filter((option) => value.includes(option.value));

  const toggle = (optionValue: string): void => {
    onChange(
      value.includes(optionValue)
        ? value.filter((current) => current !== optionValue)
        : [...value, optionValue],
    );
  };

  return (
    <div ref={ref} className="relative">
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        onClick={() => !disabled && setOpen(true)}
        className={[
          'flex min-h-[42px] w-full cursor-text flex-wrap items-center gap-[7px] rounded-xl border bg-card px-[11px] py-[9px] transition',
          disabled ? 'cursor-not-allowed opacity-50' : '',
          isOpen ? 'border-[1.5px] border-primary' : 'border-line',
        ].join(' ')}
      >
        {selected.map((option) => (
          <span
            key={option.value}
            className="flex items-center gap-[6px] rounded-lg bg-primary-soft py-[5px] pr-[6px] pl-[10px] text-[12.5px] font-bold text-primary"
          >
            {option.label}
            <button
              type="button"
              aria-label={`Retirer ${option.label}`}
              onClick={(event) => {
                event.stopPropagation();
                toggle(option.value);
              }}
              className="cursor-pointer"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M3 3l6 6M9 3l-6 6" stroke="#0A6B4E" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          </span>
        ))}
        <span className="px-1 text-[13px] font-medium text-ink-soft">{placeholder}</span>
      </div>
      {isOpen && (
        <div
          role="listbox"
          aria-multiselectable="true"
          className="rounded-tile absolute top-[48px] right-0 left-0 z-10 border border-line bg-card p-1.5 shadow-[0_18px_40px_-18px_rgba(0,0,0,.35)]"
        >
          {options.map((option) => {
            const checked = value.includes(option.value);
            return (
              <div
                key={option.value}
                role="option"
                aria-selected={checked}
                onClick={() => toggle(option.value)}
                className="flex cursor-pointer items-center justify-between rounded-lg px-[10px] py-[8px] text-[13px] font-semibold text-ink hover:bg-cream-50"
              >
                {option.label}
                <span
                  className={[
                    'flex size-4 flex-none items-center justify-center rounded-[4px]',
                    checked ? 'bg-primary' : 'border-[1.5px] border-line',
                  ].join(' ')}
                >
                  {checked && (
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                      <path
                        d="M3 6l2 2 4-5"
                        stroke="#fff"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
