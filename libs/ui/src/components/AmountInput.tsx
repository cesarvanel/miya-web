import React from 'react';

interface AmountInputProps {
  /** Montant en FCFA (entier), null quand vide. */
  value: number | null;
  onChange: (value: number | null) => void;
  placeholder?: string;
  disabled?: boolean;
  id?: string;
  'aria-label'?: string;
}

/** "1234567" → "1 234 567" (groupement des maquettes, espace simple). */
export const formatAmount = (amount: number): string =>
  String(amount).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

/** Texte saisi → entier FCFA (chiffres uniquement), null si aucun chiffre. */
export const parseAmount = (raw: string): number | null => {
  const digits = raw.replace(/\D/g, '').slice(0, 15);
  return digits === '' ? null : Number(digits);
};

export const AmountInput: React.FC<AmountInputProps> = ({
  value,
  onChange,
  placeholder = '0',
  disabled = false,
  id,
  'aria-label': ariaLabel,
}) => {
  return (
    <div
      className={[
        'rounded-input focus-within:shadow-focus-ring inline-flex items-center gap-2 border border-line bg-card px-[14px] py-[10px] transition',
        disabled ? 'pointer-events-none opacity-50' : '',
      ].join(' ')}
    >
      <input
        id={id}
        type="text"
        inputMode="numeric"
        aria-label={ariaLabel}
        disabled={disabled}
        placeholder={placeholder}
        value={value === null ? '' : formatAmount(value)}
        onChange={(event) => onChange(parseAmount(event.target.value))}
        className="num w-32 border-none bg-transparent text-right text-base font-bold text-ink outline-none placeholder:text-ink-soft"
      />
      <span className="text-xs font-semibold text-ink-disabled">FCFA</span>
    </div>
  );
};
