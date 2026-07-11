import React from 'react';

interface ProgressCellProps {
  visited: number;
  total: number;
}

/** Colonne "Progression" de la table Mes agents — visités/total + barre. */
export const ProgressCell: React.FC<ProgressCellProps> = ({ visited, total }) => {
  const percent = total > 0 ? Math.round((visited / total) * 100) : 0;
  return (
    <div>
      <div className="mb-[5px] flex items-center justify-between">
        <span className="num text-[12.5px] font-bold text-ink">
          {visited}/{total}
        </span>
        <span className="num text-[11.5px] font-semibold text-ink-faint">{percent}%</span>
      </div>
      <div className="h-[7px] overflow-hidden rounded-[5px] bg-cream-100">
        <div
          className="h-full rounded-[5px] bg-primary transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};
