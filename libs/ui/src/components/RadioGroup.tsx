import React from 'react';

export interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupProps {
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  name?: string;
}

/** Groupe de boutons radio — sélectionné/non sélectionné/désactivé. */
export const RadioGroup: React.FC<RadioGroupProps> = ({
  options,
  value,
  onChange,
  disabled = false,
  name,
}) => (
  <div role="radiogroup" className="flex flex-col gap-[11px]">
    {options.map((option) => {
      const checked = option.value === value;
      return (
        <label
          key={option.value}
          className={[
            'flex items-center gap-[10px]',
            disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
          ].join(' ')}
        >
          <button
            type="button"
            role="radio"
            aria-checked={checked}
            disabled={disabled}
            name={name}
            onClick={() => onChange(option.value)}
            className={[
              'flex size-5 flex-none cursor-pointer items-center justify-center rounded-full border-2',
              checked ? 'border-primary' : 'border-line',
            ].join(' ')}
          >
            {checked && <span className="size-[10px] rounded-full bg-primary" />}
          </button>
          <span className={['text-[13.5px] font-semibold', checked ? 'text-ink' : 'text-ink-muted'].join(' ')}>
            {option.label}
          </span>
        </label>
      );
    })}
  </div>
);
