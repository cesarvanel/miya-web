import React, { useState } from 'react';
import type { RoundStop } from '../../../domain/entities/RoundStop';
import { StopRow } from './StopRow';

interface StopsGridProps {
  stops: RoundStop[];
  maxVisible?: number;
}

const COLUMN_COUNT = 3;

/** Grille de clients à 3 colonnes (ordre colonne par colonne) — fidèle à la maquette 4. */
export const StopsGrid: React.FC<StopsGridProps> = ({ stops, maxVisible = 8 }) => {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? stops : stops.slice(0, maxVisible);
  const remaining = stops.length - visible.length;

  const perColumn = Math.ceil(visible.length / COLUMN_COUNT) || 1;
  const columns = Array.from({ length: COLUMN_COUNT }, (_, index) =>
    visible.slice(index * perColumn, (index + 1) * perColumn),
  );

  return (
    <div className="grid grid-cols-3">
      {columns.map((column, index) => (
        <div key={index} className={index < COLUMN_COUNT - 1 ? 'border-r border-line-faint' : ''}>
          {column.map((stop) => (
            <StopRow key={stop.id} stop={stop} />
          ))}
          {index === COLUMN_COUNT - 1 && remaining > 0 && (
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="flex w-full cursor-pointer items-center justify-center px-[18px] py-[13px] text-[12.5px] font-bold text-primary hover:bg-cream-50"
            >
              + {remaining} autres clients
            </button>
          )}
        </div>
      ))}
    </div>
  );
};
