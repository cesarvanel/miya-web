import React from 'react';
import { FormField } from './FormField';

interface PhoneInputProps {
  label?: string;
  /** 9 chiffres camerounais, sans mise en forme (ex. "677124509"). */
  value: string;
  onChange: (digits: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  id?: string;
}

const formatDigits = (digits: string): string => {
  const value = digits.slice(0, 9);
  return `${value.slice(0, 1)} ${value.slice(1, 3)} ${value.slice(3, 5)} ${value.slice(5, 7)} ${value.slice(7, 9)}`.trim();
};

/** Téléphone camerounais — préfixe 🇨🇲 +237, formaté au fur et à mesure de la saisie. */
export const PhoneInput: React.FC<PhoneInputProps> = ({
  label = 'Numéro de téléphone',
  value,
  onChange,
  placeholder = '6 XX XX XX XX',
  disabled = false,
  error,
  id,
}) => {
  const fieldId = id ?? 'phone-input';
  return (
    <FormField label={label} htmlFor={fieldId} error={error} disabled={disabled}>
      <div
        className={[
          'flex items-center gap-[9px] rounded-xl border bg-card px-3 py-[9px] transition',
          error
            ? 'border-[1.5px] border-danger'
            : 'border-line focus-within:border-[1.5px] focus-within:border-primary focus-within:shadow-focus-ring',
          disabled ? 'cursor-not-allowed opacity-50' : '',
        ].join(' ')}
      >
        <span className="flex items-center gap-[6px] border-r border-line pr-[9px] text-[13px] font-bold text-ink">
          <span aria-hidden="true">🇨🇲</span>+237
        </span>
        <input
          id={fieldId}
          type="tel"
          inputMode="numeric"
          disabled={disabled}
          placeholder={placeholder}
          value={formatDigits(value)}
          onChange={(event) => onChange(event.target.value.replace(/\D/g, '').slice(0, 9))}
          className="num w-full flex-1 border-none bg-transparent text-sm font-semibold tracking-[.02em] text-ink outline-none placeholder:font-medium placeholder:text-ink-soft"
        />
      </div>
    </FormField>
  );
};
