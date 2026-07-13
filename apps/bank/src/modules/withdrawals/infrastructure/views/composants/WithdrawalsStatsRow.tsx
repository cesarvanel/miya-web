import React from 'react';
import { Money } from '@miya/kernel';

interface WithdrawalsStatsRowProps {
  pendingCount: number;
  totalPendingAmount: number;
  approvedCount: number;
  totalApprovedAmount: number;
  disbursedThisMonthAmount: number;
  rejectedCount: number;
}

/** 4 tuiles KPI — chiffres calculés depuis le seed (pas de valeurs littérales de maquette). */
export const WithdrawalsStatsRow: React.FC<WithdrawalsStatsRowProps> = ({
  pendingCount,
  totalPendingAmount,
  approvedCount,
  totalApprovedAmount,
  disbursedThisMonthAmount,
  rejectedCount,
}) => (
  <div className="mb-4.5 grid grid-cols-4 gap-4">
    <div className="rounded-card-lg border-[1.5px] border-amber-strong/40 bg-card p-4.5">
      <div className="text-amber text-[12.5px] font-semibold">À traiter</div>
      <div className="num mt-2 text-[28px] leading-none font-bold text-ink">{pendingCount}</div>
      <div className="num mt-1 text-[11.5px] font-medium text-ink-faint">{Money.from(totalPendingAmount).format()} demandés</div>
    </div>
    <div className="rounded-card-lg shadow-primary-glow bg-primary p-4.5 text-white">
      <div className="text-primary-tint text-[12.5px] font-semibold">À décaisser</div>
      <div className="num mt-2 text-[28px] leading-none font-bold">{approvedCount}</div>
      <div className="text-primary-tint num mt-1 text-[11.5px] font-medium">{Money.from(totalApprovedAmount).format()} validés</div>
    </div>
    <div className="rounded-card-lg border border-line bg-card p-4.5">
      <div className="text-[12.5px] font-semibold text-ink-muted">Décaissé ce mois</div>
      <div className="num mt-2 text-[28px] leading-none font-bold text-ink">{Money.from(disbursedThisMonthAmount).format()}</div>
      <div className="mt-1 text-[11.5px] font-medium text-ink-faint">remis aux clients</div>
    </div>
    <div className="rounded-card-lg border border-line bg-card p-4.5">
      <div className="text-[12.5px] font-semibold text-ink-muted">Refusées</div>
      <div className="num mt-2 text-[28px] leading-none font-bold text-ink">{rejectedCount}</div>
      <div className="mt-1 text-[11.5px] font-medium text-ink-faint">historique</div>
    </div>
  </div>
);
