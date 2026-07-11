import React from 'react';
import { Button, Card, Skeleton } from '@miya/ui';
import { SettlementKind } from '@/modules/settlements/domain/entities/SettlementSlip';
import { PartialDepositBody } from '../composants/PartialDepositBody';
import { SettlementBody } from '../composants/SettlementBody';
import { SlipHeader } from '../composants/SlipHeader';
import { useSlipDetail } from './useSlipDetail';

/** Panneau détail du bordereau sélectionné — monté dans l'Outlet du layout settlements. */
export const SlipDetailPage: React.FC = () => {
  const {
    slip,
    subtotals,
    isPending,
    positionLabel,
    partialDepositTotal,
    firstPartialDeposit,
    openConfirmValidation,
    openReject,
  } = useSlipDetail();

  if (!slip) {
    return isPending ? (
      <Skeleton variant="card" />
    ) : (
      <div className="text-sm font-medium text-ink-muted">
        Bordereau introuvable.
      </div>
    );
  }

  const isPartialDeposit = slip.kind === SettlementKind.PartialDeposit;
  const context = slip.partialDepositContext;

  return (
    <Card className="max-w-180">
      <SlipHeader
        agentName={slip.agentName}
        slipMeta={
          isPartialDeposit && context
            ? `${slip.slipNumber} · Zone ${slip.zone} · ${context.visitedClients} / ${slip.clientCount} clients`
            : `${slip.slipNumber} · Zone ${slip.zone} · ${slip.clientCount} clients`
        }
        statusBadge={
          isPartialDeposit && context
            ? { label: `Tournée en cours · ${context.tourProgressPercent}%`, tone: 'primary' }
            : slip.closedAt
              ? { label: `Journée clôturée ${slip.closedAt}`, tone: 'amber' }
              : undefined
        }
        cornerBadge={
          isPartialDeposit
            ? { label: 'Dépôt partiel', tone: 'amber' }
            : positionLabel
              ? { label: positionLabel, tone: 'neutral' }
              : undefined
        }
      />

      {isPartialDeposit ? (
        <PartialDepositBody slip={slip} />
      ) : (
        <SettlementBody
          slip={slip}
          subtotals={subtotals}
          partialDepositTotal={partialDepositTotal}
          firstPartialDeposit={firstPartialDeposit}
        />
      )}

      <div className="mt-5 flex gap-3">
        <Button variant="primary" className="flex-1" onClick={openConfirmValidation}>
          {isPartialDeposit ? 'Valider le dépôt partiel' : 'Valider le reversement'}
        </Button>
        <Button variant="destructive" onClick={openReject}>
          Rejeter
        </Button>
      </div>
    </Card>
  );
};
