import React, { useState } from 'react';
import { useOutsideClick } from '../internal/useOutsideClick';

interface SearchableSelectProps<TOption> {
  options: TOption[];
  value: TOption | null;
  onChange: (value: TOption) => void;
  getId: (option: TOption) => string;
  getLabel: (option: TOption) => string;
  /** Rendu personnalisé d'une option dans le menu (ex. avatar + méta). */
  renderOption?: (option: TOption) => React.ReactNode;
  /** Rendu personnalisé de la valeur sélectionnée (état "rempli"). */
  renderValue?: (option: TOption) => React.ReactNode;
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
}

const SearchIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <circle cx="7" cy="7" r="5" stroke={color} strokeWidth="1.6" />
    <path d="M11 11l3 3" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const ChevronDownIcon: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M4 5.5L7 8.5l3-3" stroke="#6B7069" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
 * Select générique avec recherche intégrée (même pattern générique que
 * `Table<TRow>`) — défaut/ouvert+recherche/rempli/désactivé.
 */
export const SearchableSelect = <TOption,>({
  options,
  value,
  onChange,
  getId,
  getLabel,
  renderOption,
  renderValue,
  placeholder = 'Sélectionner…',
  searchPlaceholder = 'Rechercher…',
  disabled = false,
}: SearchableSelectProps<TOption>): React.ReactElement => {
  const [isOpen, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const ref = useOutsideClick<HTMLDivElement>(() => {
    setOpen(false);
    setQuery('');
  }, isOpen);

  const filtered = options.filter((option) =>
    getLabel(option).toLowerCase().includes(query.toLowerCase()),
  );

  const handleSelect = (option: TOption): void => {
    onChange(option);
    setOpen(false);
    setQuery('');
  };

  return (
    <div ref={ref} className="relative">
      {isOpen ? (
        <div className="focus-within:shadow-focus-ring flex items-center gap-[9px] rounded-xl border-[1.5px] border-primary bg-card px-[13px] py-[10.5px]">
          <SearchIcon color="#0A6B4E" />
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={searchPlaceholder}
            className="w-full border-none bg-transparent text-[13.5px] font-semibold text-ink outline-none placeholder:font-medium placeholder:text-ink-soft"
          />
        </div>
      ) : (
        <button
          type="button"
          disabled={disabled}
          onClick={() => setOpen(true)}
          className="flex w-full cursor-pointer items-center justify-between rounded-xl border border-line bg-card px-[14px] py-[11px] text-left transition hover:bg-cream-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {value ? (
            <span className="flex min-w-0 flex-1 items-center gap-[9px]">
              {renderValue ? (
                renderValue(value)
              ) : (
                <span className="truncate text-[13.5px] font-bold text-ink">
                  {getLabel(value)}
                </span>
              )}
            </span>
          ) : (
            <span className="text-[13.5px] font-medium text-ink-soft">{placeholder}</span>
          )}
          <ChevronDownIcon />
        </button>
      )}
      {isOpen && (
        <div
          role="listbox"
          className="rounded-tile absolute top-[50px] right-0 left-0 z-10 max-h-72 overflow-auto border border-line bg-card p-1.5 shadow-[0_18px_40px_-18px_rgba(0,0,0,.35)]"
        >
          {filtered.length === 0 && (
            <div className="px-[11px] py-[9px] text-[13px] font-medium text-ink-soft">
              Aucun résultat
            </div>
          )}
          {filtered.map((option) => (
            <div
              key={getId(option)}
              role="option"
              aria-selected={value ? getId(value) === getId(option) : false}
              onClick={() => handleSelect(option)}
              className="flex cursor-pointer items-center gap-[10px] rounded-lg px-[10px] py-[8px] hover:bg-cream-50"
            >
              {renderOption ? (
                renderOption(option)
              ) : (
                <span className="text-[13px] font-semibold text-ink">{getLabel(option)}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
