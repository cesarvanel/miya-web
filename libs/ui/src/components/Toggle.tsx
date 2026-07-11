import React from 'react';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  'aria-label'?: string;
}

/** Interrupteur activé/désactivé/verrouillé. */
export const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  disabled = false,
  label,
  'aria-label': ariaLabel,
}) => (
  <label
    className={['inline-flex items-center gap-2', disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'].join(
      ' ',
    )}
  >
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel ?? label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={[
        'relative h-[27px] w-[46px] flex-none cursor-pointer rounded-full transition',
        checked ? 'bg-primary' : 'bg-line',
      ].join(' ')}
    >
      <span
        className={[
          'absolute top-[3px] size-[21px] rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,.25)] transition-all',
          checked ? 'left-[22px]' : 'left-[3px]',
        ].join(' ')}
      />
    </button>
    {label && <span className="text-[13.5px] font-semibold text-ink">{label}</span>}
  </label>
);
