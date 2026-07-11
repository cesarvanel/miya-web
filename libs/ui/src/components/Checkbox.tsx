import React from 'react';

interface CheckboxProps {
  /** `'indeterminate'` pour une sélection partielle (ex. "toutes les zones" partiel). */
  checked: boolean | 'indeterminate';
  onChange: (checked: boolean) => void;
  label?: React.ReactNode;
  disabled?: boolean;
}

/** Case à cocher — coché/décoché/indéterminé/désactivé. */
export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
}) => {
  const isChecked = checked === true;
  const isIndeterminate = checked === 'indeterminate';

  return (
    <label
      className={['flex items-center gap-[10px]', disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'].join(
        ' ',
      )}
    >
      <button
        type="button"
        role="checkbox"
        aria-checked={isIndeterminate ? 'mixed' : isChecked}
        disabled={disabled}
        onClick={() => onChange(!isChecked)}
        className={[
          'flex size-5 flex-none cursor-pointer items-center justify-center rounded-[6px] transition',
          isChecked || isIndeterminate ? 'bg-primary' : 'border-[1.5px] border-line',
        ].join(' ')}
      >
        {isChecked && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path
              d="M3 6l2 2 4-5"
              stroke="#fff"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
        {isIndeterminate && <span className="h-[2.4px] w-[10px] rounded-sm bg-white" />}
      </button>
      {label && <span className="text-[13.5px] font-semibold text-ink">{label}</span>}
    </label>
  );
};
