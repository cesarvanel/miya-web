import React from 'react';
import { FormField } from './FormField';

interface TextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
  required?: boolean;
  id?: string;
}

/** Champ texte labellisé — défaut/focus/rempli/erreur/désactivé. */
export const TextField: React.FC<TextFieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
  error,
  hint,
  disabled = false,
  required,
  id,
}) => {
  const fieldId = id ?? label.toLowerCase().replace(/\s+/g, '-');
  return (
    <FormField label={label} htmlFor={fieldId} required={required} error={error} hint={hint} disabled={disabled}>
      <input
        id={fieldId}
        type="text"
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className={[
          'w-full rounded-[11px] border px-[13px] py-[11px] text-[13.5px] font-semibold text-ink outline-none transition placeholder:font-medium placeholder:text-ink-soft',
          error
            ? 'border-[1.5px] border-danger'
            : 'border-line bg-card focus:border-[1.5px] focus:border-primary focus:shadow-focus-ring',
          disabled ? 'cursor-not-allowed border-line-soft bg-cream text-ink-disabled' : 'bg-card',
        ].join(' ')}
      />
    </FormField>
  );
};
