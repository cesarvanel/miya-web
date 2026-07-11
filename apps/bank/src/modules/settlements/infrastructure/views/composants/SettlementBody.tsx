import React, { useState } from 'react';
import { InitialsAvatar, Pagination, StatusBadge } from '@miya/ui';
import { Money } from '@miya/kernel';
import {
  SettlementLineStatus,
  type SettlementSlip,
} from '@/modules/settlements/domain/entities/SettlementSlip';
import type { SlipSubtotals } from '@/modules/settlements/domain/types/Type';
import { StatusTile } from './StatusTile';

const lineStatusMeta: Record<
  SettlementLineStatus,
  { label: string; badge: 'collected' | 'pending' | 'disputed' | 'absent' }
> = {
  [SettlementLineStatus.Collected]: { label: 'Cotisé', badge: 'collected' },
  [SettlementLineStatus.Extra]: { label: 'Supplément.', badge: 'pending' },
  [SettlementLineStatus.Absent]: { label: 'Absent', badge: 'absent' },
  [SettlementLineStatus.Disputed]: { label: 'Litige', badge: 'disputed' },
};

interface SettlementBodyProps {
  slip: SettlementSlip;
  subtotals: SlipSubtotals;
  partialDepositTotal: Money;
  firstPartialDeposit: SettlementSlip['partialDeposits'][number] | undefined;
}

/** Corps du détail d'un reversement du soir — montant système, sous-totaux, détail client. */
export const SettlementBody: React.FC<SettlementBodyProps> = ({
  slip,
  subtotals,
  partialDepositTotal,
  firstPartialDeposit,
}) => {
  const pageSize = 10;
  const [page, setPage] = useState(1);
  const pageCount = Math.max(1, Math.ceil(slip.lines.length / pageSize));
  const visibleLines = slip.lines.slice((page - 1) * pageSize, page * pageSize);

  return (
    <>
      <div className="rounded-card mt-5 bg-primary-deep px-[26px] py-6 text-white">
        <div className="text-[13px] font-bold tracking-[.06em] text-primary-bright uppercase">
          Montant à reverser · calculé par le système
        </div>
        <div className="num mt-2 text-[42px] font-bold tracking-[-0.03em]">
          {Money.from(slip.expectedAmount).format()}
        </div>
        <div className="mt-[10px] w-fit rounded-tile bg-white/10 px-[14px] py-[9px] text-[12.5px] font-semibold text-primary-tint">
          Comptez le cash physique et comparez. Vous ne saisissez aucun
          montant.
        </div>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-[10px]">
        <StatusTile
          label="Cotisé"
          value={subtotals.collected.amount.format()}
          hint={`${subtotals.collected.count} clients`}
        />
        <StatusTile
          label="Supplément."
          value={subtotals.extra.amount.format()}
          hint={`${subtotals.extra.count} clients`}
        />
        <StatusTile
          label="Absent/Reporté"
          value="—"
          hint={`${subtotals.absent.count} clients`}
        />
        <StatusTile
          label="Dépôt partiel"
          tone="info"
          value={
            slip.partialDeposits.length > 0
              ? `−${partialDepositTotal.format()}`
              : '—'
          }
          hint={firstPartialDeposit ? `validé ${firstPartialDeposit.validatedAt}` : ''}
        />
      </div>

      {firstPartialDeposit && (
        <div className="rounded-tile mt-3 bg-info-soft px-[15px] py-3 text-[12.5px] font-semibold text-info">
          Un dépôt partiel de {partialDepositTotal.format()} a déjà été
          validé aujourd'hui à {firstPartialDeposit.validatedAt} (plafond
          atteint). Il est déduit du montant à reverser.
        </div>
      )}

      <div className="rounded-card-lg mt-[18px] overflow-hidden border border-line">
        <div className="flex items-center justify-between border-b border-line-soft px-[18px] py-[14px]">
          <span className="text-sm font-extrabold text-ink">
            Détail par client
          </span>
          <span className="text-xs font-semibold text-ink-faint">
            {slip.lines.length} ligne{slip.lines.length > 1 ? 's' : ''} · triées
            par heure
          </span>
        </div>
        <div className="divide-y divide-line-faint">
          {visibleLines.map((line) => {
            const meta = lineStatusMeta[line.status];
            return (
              <div
                key={line.clientId}
                className="grid grid-cols-[2fr_1fr_1fr_1.2fr] items-center gap-3 px-[18px] py-3"
              >
                <div className="flex items-center gap-[10px]">
                  <InitialsAvatar name={line.clientName} size="sm" />
                  <span className="text-[13.5px] font-semibold text-ink">
                    {line.clientName}
                  </span>
                </div>
                <span className="num text-[13px] text-ink-muted">
                  {line.collectedAt ?? '—'}
                </span>
                <span className="num text-right text-sm font-bold text-ink">
                  {line.status === SettlementLineStatus.Absent
                    ? '—'
                    : Money.from(line.amount).format()}
                </span>
                <div className="text-right">
                  <StatusBadge status={meta.badge}>{meta.label}</StatusBadge>
                </div>
              </div>
            );
          })}
        </div>
        <Pagination page={page} pageCount={pageCount} onChange={setPage} />
      </div>
    </>
  );
};
