import React from 'react';
import { Money } from '@miya/kernel';
import type { AgentMonthStats } from '../../../domain/entities/Agent';

interface MonthStatsCellProps {
  stats: AgentMonthStats;
}

/** Collecté du mois + taux de confirmation, ou signalement d'écarts/contestations si présents. */
export const MonthStatsCell: React.FC<MonthStatsCellProps> = ({ stats }) => {
  if (stats.collected === 0 && stats.confirmationRate === 0) {
    return <span className="text-[12.5px] font-medium text-ink-faint">—</span>;
  }
  return (
    <div>
      <div className="num text-[13px] font-bold text-ink">{Money.from(stats.collected).format()}</div>
      {stats.gaps > 0 ? (
        <div className="text-[11px] font-bold text-amber">
          {stats.gaps} {stats.gaps > 1 ? 'signalements' : 'signalement'}
        </div>
      ) : (
        <div className="num text-[11px] font-semibold text-ink-faint">
          {stats.confirmationRate.toFixed(1).replace('.', ',')}% conf.
        </div>
      )}
    </div>
  );
};
