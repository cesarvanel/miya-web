import React, { useState } from 'react';

interface PasswordFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
  required?: boolean;
  id?: string;
  /** Ex. le lien « Oublié ? » aligné à droite du label. */
  labelRight?: React.ReactNode;
  autoFocus?: boolean;
}

const EyeIcon: React.FC<{ open: boolean }> = ({ open }) =>
  open ? (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden="true">
      <path d="M1.5 8.5S4.3 3.5 8.5 3.5 15.5 8.5 15.5 8.5 12.7 13.5 8.5 13.5 1.5 8.5 1.5 8.5z" stroke="#8A8A82" strokeWidth="1.4" strokeLinejoin="round" />
      <circle cx="8.5" cy="8.5" r="2.2" stroke="#8A8A82" strokeWidth="1.4" />
    </svg>
  ) : (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden="true">
      <path d="M1.5 8.5S4.3 3.5 8.5 3.5c1.4 0 2.6.34 3.66.88M15.5 8.5S14 11 11.8 12.4M6.7 6.8a2.2 2.2 0 0 0 3.1 3.1" stroke="#8A8A82" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 2l13 13" stroke="#8A8A82" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );

/** Champ mot de passe avec bascule afficher/masquer — mêmes états que TextField. */
export const PasswordField: React.FC<PasswordFieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
  error,
  hint,
  disabled = false,
  required,
  id,
  labelRight,
  autoFocus,
}) => {
  const [visible, setVisible] = useState(false);
  const fieldId = id ?? label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div>
      <div className="mb-[7px] flex items-center justify-between">
        <label htmlFor={fieldId} className={['text-[11.5px] font-bold', disabled ? 'text-ink-disabled' : 'text-ink'].join(' ')}>
          {label} {required && <span className="text-danger">*</span>}
        </label>
        {labelRight}
      </div>
      <div className="relative">
        <input
          id={fieldId}
          type={visible ? 'text' : 'password'}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          autoFocus={autoFocus}
          onChange={(event) => onChange(event.target.value)}
          className={[
            'w-full rounded-[11px] border px-[13px] py-[11px] pr-10 text-[13.5px] font-semibold text-ink outline-none transition placeholder:font-medium placeholder:text-ink-soft',
            error
              ? 'border-[1.5px] border-danger'
              : 'border-line bg-card focus:border-[1.5px] focus:border-primary focus:shadow-focus-ring',
            disabled ? 'cursor-not-allowed border-line-soft bg-cream text-ink-disabled' : 'bg-card',
          ].join(' ')}
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
          className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
        >
          <EyeIcon open={visible} />
        </button>
      </div>
      {error?.trim() ? (
        <div className="mt-1.5 flex items-center gap-[5px] text-[11px] font-semibold text-danger">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <circle cx="6" cy="6" r="5" stroke="#C43B32" strokeWidth="1.3" />
            <path d="M6 3.5v3M6 8.2h.01" stroke="#C43B32" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          {error}
        </div>
      ) : (
        hint && <div className="mt-1.5 text-[11px] font-semibold text-ink-disabled">{hint}</div>
      )}
    </div>
  );
};
