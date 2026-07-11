import React from 'react';

export interface FilterChip {
  id: string;
  label: string;
  /** Chip en surbrillance verte (ex. filtre numérique actif). */
  emphasis?: boolean;
}

interface FilterChipsProps {
  filters: FilterChip[];
  onRemove: (id: string) => void;
  onClearAll: () => void;
}

/** Barre de filtres actifs — chips supprimables + "Tout effacer". Rien si vide. */
export const FilterChips: React.FC<FilterChipsProps> = ({
  filters,
  onRemove,
  onClearAll,
}) => {
  if (filters.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-[12.5px] font-semibold text-ink-faint">Filtres :</span>
      {filters.map((filter) => (
        <span
          key={filter.id}
          className={[
            'flex items-center gap-[7px] rounded-full py-1.5 pr-2 pl-3 text-[12.5px] font-bold',
            filter.emphasis ? 'bg-primary-soft text-primary' : 'bg-cream-100 text-ink',
          ].join(' ')}
        >
          {filter.label}
          <button
            type="button"
            aria-label={`Retirer ${filter.label}`}
            onClick={() => onRemove(filter.id)}
            className="cursor-pointer"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path
                d="M3 3l6 6M9 3l-6 6"
                stroke={filter.emphasis ? '#0A6B4E' : '#6B7069'}
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </span>
      ))}
      <button
        type="button"
        onClick={onClearAll}
        className="cursor-pointer px-2 py-1.5 text-[12.5px] font-bold text-danger"
      >
        Tout effacer
      </button>
    </div>
  );
};
