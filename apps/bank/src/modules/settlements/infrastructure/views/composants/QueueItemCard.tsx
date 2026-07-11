import React from 'react';
import { Link } from 'react-router-dom';
import { InitialsAvatar } from '@miya/ui';
import { Money } from '@miya/kernel';
import { SettlementKind, type SettlementSlip } from '@/modules/settlements/domain/entities/SettlementSlip';
import { SettlementsRoutes } from '../../router/SettlementsRoutes';

interface QueueItemCardProps {
  slip: SettlementSlip;
  isSelected: boolean;
  disputeCount: number;
}

/**
 * Carte de la file d'attente — reversement (vert) ou dépôt partiel (ambre,
 * maquette 2d) : le thème de couleur suit `slip.kind`, la sélection suit
 * l'id dans l'URL (bordure 2px).
 */
export const QueueItemCard: React.FC<QueueItemCardProps> = ({
  slip,
  isSelected,
  disputeCount,
}) => {
  const isPartialDeposit = slip.kind === SettlementKind.PartialDeposit;

  const badge = isSelected
    ? { label: 'EN COURS', classes: isPartialDeposit ? 'bg-amber-soft text-amber' : 'bg-primary-soft text-primary' }
    : !isPartialDeposit && disputeCount > 0
      ? {
          label: `${disputeCount} LITIGE${disputeCount > 1 ? 'S' : ''}`,
          classes: 'bg-amber-soft text-amber',
        }
      : null;

  return (
    <Link
      to={SettlementsRoutes.buildDetailPath(slip.id)}
      aria-current={isSelected ? 'true' : undefined}
      className={[
        'block rounded-2xl bg-card transition',
        isSelected
          ? [
              'border-2 p-2.75',
              isPartialDeposit ? 'border-amber-strong' : 'border-primary',
            ].join(' ')
          : 'border border-line p-3.25 hover:border-primary/40',
      ].join(' ')}
    >
      <div className="flex items-center gap-2.75">
        <InitialsAvatar name={slip.agentName} />
        <div className="min-w-0 flex-1">
          <div className="text-sm font-bold text-ink">{slip.agentName}</div>
          <div className="num text-xs font-semibold text-ink-muted">
            {slip.slipNumber}
          </div>
        </div>
        {badge && (
          <span
            className={[
              'rounded-full px-2.25 py-1 text-[10.5px] font-bold whitespace-nowrap',
              badge.classes,
            ].join(' ')}
          >
            {badge.label}
          </span>
        )}
      </div>
      <div className="mt-2.75 flex items-center justify-between">
        <span
          className={[
            'num text-xl font-bold',
            isSelected ? 'text-ink' : 'text-ink-muted',
          ].join(' ')}
        >
          {Money.from(slip.expectedAmount).format()}
        </span>
        <span className="text-xs font-semibold text-ink-faint">{slip.zone}</span>
      </div>
    </Link>
  );
};
