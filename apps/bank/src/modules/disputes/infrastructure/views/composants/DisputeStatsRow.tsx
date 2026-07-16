import React from 'react';
import { CountUp } from '@miya/ui';
import { formatAmount } from './formatAmount';

interface DisputeStatsRowProps {
  openCount: number;
  resolvedCount: number;
  averageDelayMinutes: number | null;
  openGapTotal: number;
}

const formatDelay = (minutes: number | null): React.ReactNode => {
  if (minutes === null) {
    return '—';
  }
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return (
    <>
      {hours}
      <span className="text-ink-disabled text-[18px]">h {String(remainder).padStart(2, '0')}</span>
    </>
  );
};

/** Bandeau de stats du jour — fidèle à la maquette 3a (4 tuiles). */
export const DisputeStatsRow: React.FC<DisputeStatsRowProps> = ({
  openCount,
  resolvedCount,
  averageDelayMinutes,
  openGapTotal,
}) => (
  <div className="mb-5 grid grid-cols-4 gap-4">
    <div
      className={[
        'rounded-card-lg bg-card p-[18px]',
        openCount > 0 ? 'border-[1.5px] border-danger/30' : 'border border-line',
      ].join(' ')}
    >
      <div className="text-[12.5px] font-semibold text-danger">Ouvertes</div>
      <div className="mt-2 text-[30px] font-bold text-danger"><CountUp value={openCount} /></div>
      <div className="mt-1 text-[11.5px] font-medium text-danger-deep">à trancher aujourd'hui</div>
    </div>
    <div className="rounded-card-lg border border-line bg-card p-[18px]">
      <div className="text-[12.5px] font-semibold text-ink-muted">Résolues aujourd'hui</div>
      <div className="mt-2 text-[30px] font-bold text-primary"><CountUp value={resolvedCount} /></div>
      <div className="mt-1 text-[11.5px] font-medium text-ink-faint">tracées &amp; notifiées</div>
    </div>
    <div className="rounded-card-lg border border-line bg-card p-[18px]">
      <div className="text-[12.5px] font-semibold text-ink-muted">Délai moyen</div>
      <div className="num mt-2 text-[30px] font-bold text-ink">{formatDelay(averageDelayMinutes)}</div>
      <div className="mt-1 text-[11.5px] font-medium text-ink-faint">ouverture → décision</div>
    </div>
    <div className="rounded-card-lg border border-line bg-card p-[18px]">
      <div className="text-[12.5px] font-semibold text-ink-muted">Écart cumulé en jeu</div>
      <div className="mt-2 text-[30px] font-bold text-ink"><CountUp value={openGapTotal} formatter={formatAmount} /></div>
      <div className="mt-1 text-[11.5px] font-medium text-ink-faint">FCFA · {openCount} dossier{openCount > 1 ? 's' : ''}</div>
    </div>
  </div>
);
