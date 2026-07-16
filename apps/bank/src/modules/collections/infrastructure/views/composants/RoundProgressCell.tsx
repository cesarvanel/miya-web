import React from 'react';
import type { RoundProgress } from '../../../domain/entities/CollectionRound';

interface RoundProgressCellProps {
  progress: RoundProgress;
}

export const RoundProgressCell: React.FC<RoundProgressCellProps> = ({ progress }) => {
  const ratio = progress.expected === 0 ? 0 : progress.visited / progress.expected;
  const percent = Math.round(ratio * 100);
  return (
    <div>
      <div className="mb-1.25 flex justify-between">
        <span className="num text-[12.5px] font-bold text-ink">
          {progress.visited}/{progress.expected}
        </span>
        <span className="num text-[11.5px] font-semibold text-ink-faint">{percent}%</span>
      </div>
      <div className="h-1.75 overflow-hidden rounded-full bg-cream-100">
        <div className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
};
