import React from 'react';
import { AttentionSeverity, type AttentionPoint } from '../../../domain/entities/Supervision';

interface AttentionPointsGridProps {
  points: AttentionPoint[];
}

/** Points d'attention — grille d'alertes 3 colonnes. Maquette 10a. */
export const AttentionPointsGrid: React.FC<AttentionPointsGridProps> = ({ points }) => {
  if (points.length === 0) {
    return null;
  }
  return (
    <div className="rounded-card-lg border border-line bg-card p-5">
      <div className="mb-3.5 text-[15px] font-extrabold text-ink">Points d&rsquo;attention</div>
      <div className="grid grid-cols-3 gap-3.5">
        {points.map((point) => {
          const isDanger = point.severity === AttentionSeverity.Danger;
          return (
            <div
              key={point.id}
              className={[
                'rounded-xl border p-3.5',
                isDanger ? 'border-danger/30 bg-danger-soft' : 'border-amber-border bg-amber-soft',
              ].join(' ')}
            >
              <div className={['text-[12.5px] font-extrabold', isDanger ? 'text-danger' : 'text-amber-deep'].join(' ')}>
                {point.title}
              </div>
              <div className={['mt-1 text-[11.5px] leading-[1.4] font-medium', isDanger ? 'text-danger' : 'text-amber-deep'].join(' ')}>
                {point.description}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
