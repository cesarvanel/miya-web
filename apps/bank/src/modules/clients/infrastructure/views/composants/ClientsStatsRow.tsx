import React from 'react';
import { Money } from '@miya/kernel';

interface ClientsStatsRowProps {
  totalActiveCount: number;
  totalSavings: number;
  averageRegularityRatio: number;
  withdrawalPendingCount: number;
}

/** Bandeau de stats du listing — fidèle à la maquette 6a (4 tuiles). */
export const ClientsStatsRow: React.FC<ClientsStatsRowProps> = ({
  totalActiveCount,
  totalSavings,
  averageRegularityRatio,
  withdrawalPendingCount,
}) => (
  <div className="mb-5 grid grid-cols-4 gap-4">
    <div className="rounded-card-lg shadow-primary-glow bg-primary p-[18px] text-white">
      <div className="text-primary-tint text-[12.5px] font-semibold">Clients actifs</div>
      <div className="num mt-2 text-[30px] font-bold">{totalActiveCount.toLocaleString('fr-FR')}</div>
      <div className="text-primary-tint mt-1 text-[11.5px] font-medium">agence Mokolo</div>
    </div>
    <div className="rounded-card-lg border border-line bg-card p-[18px]">
      <div className="text-[12.5px] font-semibold text-ink-muted">Épargne totale gérée</div>
      <div className="num mt-2 text-[30px] font-bold text-ink">
        {Money.from(totalSavings).format().replace(' FCFA', '')}
      </div>
      <div className="mt-1 text-[11.5px] font-medium text-ink-faint">FCFA · tous comptes</div>
    </div>
    <div className="rounded-card-lg border border-line bg-card p-[18px]">
      <div className="text-[12.5px] font-semibold text-ink-muted">Régularité moyenne</div>
      <div className="num mt-2 text-[30px] font-bold text-ink">{Math.round(averageRegularityRatio * 100)}%</div>
      <div className="mt-1 text-[11.5px] font-medium text-ink-faint">jours cotisés</div>
    </div>
    <div
      className={[
        'rounded-card-lg p-[18px]',
        withdrawalPendingCount > 0 ? 'border-[1.5px] border-amber-border bg-card' : 'border border-line bg-card',
      ].join(' ')}
    >
      <div className={['text-[12.5px] font-semibold', withdrawalPendingCount > 0 ? 'text-amber' : 'text-ink-muted'].join(' ')}>
        Retrait en cours
      </div>
      <div className={['num mt-2 text-[30px] font-bold', withdrawalPendingCount > 0 ? 'text-amber' : 'text-ink'].join(' ')}>
        {withdrawalPendingCount}
      </div>
      <div className={['mt-1 text-[11.5px] font-medium', withdrawalPendingCount > 0 ? 'text-amber-deep' : 'text-ink-faint'].join(' ')}>
        décaissement à traiter
      </div>
    </div>
  </div>
);
