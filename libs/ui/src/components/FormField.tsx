import React from 'react';

interface FormFieldProps {
  label: string;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  disabled?: boolean;
  children: React.ReactNode;
}

/** Enveloppe label + erreur/hint, partagée par les champs de formulaire. */
export const FormField: React.FC<FormFieldProps> = ({
  label,
  htmlFor,
  required,
  error,
  hint,
  disabled = false,
  children,
}) => (
  <div>
    <label
      htmlFor={htmlFor}
      className={['mb-[7px] block text-[11.5px] font-bold', disabled ? 'text-ink-disabled' : 'text-ink'].join(' ')}
    >
      {label} {required && <span className="text-danger">*</span>}
    </label>
    {children}
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
