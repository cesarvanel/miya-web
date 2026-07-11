import React from 'react';

interface TextareaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  required?: boolean;
  error?: string;
  hint?: string;
  placeholder?: string;
  id?: string;
  rows?: number;
}

/** Zone de texte labellisée — motif obligatoire avec compteur de caractères. */
export const Textarea: React.FC<TextareaProps> = ({
  label,
  value,
  onChange,
  maxLength,
  required,
  error,
  hint,
  placeholder,
  id,
  rows = 3,
}) => {
  const fieldId = id ?? label.toLowerCase().replace(/\s+/g, '-');
  return (
    <div>
      <label htmlFor={fieldId} className="mb-[7px] block text-[12.5px] font-bold text-ink">
        {label} {required && <span className="text-danger">*</span>}
      </label>
      <textarea
        id={fieldId}
        value={value}
        rows={rows}
        placeholder={placeholder}
        maxLength={maxLength}
        onChange={(event) => onChange(event.target.value)}
        className={[
          'w-full rounded-xl border bg-card p-[13px] text-[13.5px] font-medium text-ink outline-none transition placeholder:text-ink-soft',
          error
            ? 'border-[1.5px] border-danger'
            : 'border-line focus:border-[1.5px] focus:border-primary focus:shadow-focus-ring',
        ].join(' ')}
      />
      <div className="mt-1.5 flex items-center justify-between">
        <span className="text-[11px] font-semibold text-ink-faint">
          {error ?? hint ?? ''}
        </span>
        {maxLength !== undefined && (
          <span className="num text-[11px] font-semibold text-ink-faint">
            {value.length} / {maxLength}
          </span>
        )}
      </div>
    </div>
  );
};
