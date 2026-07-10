import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Card, InitialsAvatar, Skeleton, StatusBadge } from '@miya/ui';
import { Money, useRequestStatus } from '@miya/kernel';
import { useBankDispatch, useBankSelector } from '@/config/stores/root-hook/RootHook';
import { PageShell } from '@/shared/layout/PageShell';
import { openModal } from '@/shared/modals';
import { FetchSlipAsync } from '../../application/usecases/FetchSlipAsync';
import type { SettlementLineStatus } from '../../domain/entities/SettlementSlip';
import { selectQueue, selectSlipById, selectSlipSubtotals } from '../../domain/selectors/Selectors';
import { ConfirmValidationModal } from './ConfirmValidationModal';
import { RejectSettlementModal } from './RejectSettlementModal';

const lineStatusMeta: Record<
  SettlementLineStatus,
  { label: string; badge: 'collected' | 'pending' | 'disputed' | 'absent' }
> = {
  collected: { label: 'Cotisé', badge: 'collected' },
  extra: { label: 'Supplément.', badge: 'pending' },
  absent: { label: 'Absent', badge: 'absent' },
  disputed: { label: 'Litige', badge: 'disputed' },
};

/** Bordereau ouvert : montant système, détail par client, sous-totaux par statut. */
export const SlipDetailPage: React.FC = () => {
  const { id = '' } = useParams<{ id: string }>();
  const dispatch = useBankDispatch();
  const navigate = useNavigate();
  const slip = useBankSelector((state) => selectSlipById(state, id));
  const subtotals = useBankSelector((state) => selectSlipSubtotals(state, id));
  const queue = useBankSelector(selectQueue);
  const { isPending } = useRequestStatus(FetchSlipAsync);

  if (!slip) {
    return (
      <PageShell title="Reversements">
        {isPending ? (
          <Skeleton variant="card" />
        ) : (
          <div className="text-sm font-medium text-ink-muted">
            Bordereau introuvable.
          </div>
        )}
      </PageShell>
    );
  }

  const position = queue.findIndex((item) => item.id === slip.id);
  const positionLabel =
    position >= 0 ? `Bordereau ${position + 1} / ${queue.length}` : null;
  const partialDepositTotal = slip.partialDeposits.reduce(
    (total, deposit) => total.add(Money.from(deposit.amount)),
    Money.from(0),
  );
  const firstPartialDeposit = slip.partialDeposits[0];

  return (
    <PageShell title="Reversements" subtitle={`${slip.agentName} · ${slip.slipNumber}`}>
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-4 cursor-pointer text-xs font-bold text-ink-muted hover:text-ink"
      >
        ← Retour à la file
      </button>

      <Card className="max-w-[720px]">
        <div className="flex items-center gap-[14px]">
          <InitialsAvatar name={slip.agentName} size="lg" />
          <div className="flex-1">
            <div className="flex items-center gap-[10px]">
              <span className="text-xl font-extrabold text-ink">
                {slip.agentName}
              </span>
              {slip.closedAt && (
                <span className="rounded-full bg-amber-soft px-[10px] py-1 text-[11px] font-bold text-amber">
                  Journée clôturée {slip.closedAt}
                </span>
              )}
            </div>
            <div className="num mt-0.5 text-[13px] font-semibold text-ink-muted">
              {slip.slipNumber} · Zone {slip.zone} · {slip.clientCount} clients
            </div>
          </div>
          {positionLabel && (
            <span className="num rounded-full bg-cream-100 px-3 py-[7px] text-[12.5px] font-bold text-ink-muted">
              {positionLabel}
            </span>
          )}
        </div>

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
          <div className="rounded-tile border border-line bg-cream px-[14px] py-[13px]">
            <div className="text-[11.5px] font-semibold text-ink-muted">
              Cotisé
            </div>
            <div className="num mt-[6px] text-[17px] font-bold text-ink">
              {subtotals.collected.amount.format()}
            </div>
            <div className="text-[11px] font-semibold text-ink-faint">
              {subtotals.collected.count} clients
            </div>
          </div>
          <div className="rounded-tile border border-line bg-cream px-[14px] py-[13px]">
            <div className="text-[11.5px] font-semibold text-ink-muted">
              Supplément.
            </div>
            <div className="num mt-[6px] text-[17px] font-bold text-ink">
              {subtotals.extra.amount.format()}
            </div>
            <div className="text-[11px] font-semibold text-ink-faint">
              {subtotals.extra.count} clients
            </div>
          </div>
          <div className="rounded-tile border border-line bg-cream px-[14px] py-[13px]">
            <div className="text-[11.5px] font-semibold text-ink-muted">
              Absent/Reporté
            </div>
            <div className="num mt-[6px] text-[17px] font-bold text-ink-faint">
              —
            </div>
            <div className="text-[11px] font-semibold text-ink-faint">
              {subtotals.absent.count} clients
            </div>
          </div>
          <div className="rounded-tile border border-info/30 bg-info-soft px-[14px] py-[13px]">
            <div className="text-[11.5px] font-semibold text-info">
              Dépôt partiel
            </div>
            <div className="num mt-[6px] text-[17px] font-bold text-info">
              {slip.partialDeposits.length > 0
                ? `−${partialDepositTotal.format()}`
                : '—'}
            </div>
            <div className="text-[11px] font-semibold text-info">
              {firstPartialDeposit ? `validé ${firstPartialDeposit.validatedAt}` : ''}
            </div>
          </div>
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
              {slip.lines.length} ligne{slip.lines.length > 1 ? 's' : ''}
            </span>
          </div>
          <div className="divide-y divide-line-faint">
            {slip.lines.map((line) => {
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
                    {line.status === 'absent'
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
        </div>

        <div className="mt-5 flex gap-3">
          <Button
            variant="primary"
            className="flex-1"
            onClick={() =>
              dispatch(
                openModal({ type: 'confirmValidation', props: { slipId: slip.id } }),
              )
            }
          >
            Valider le reversement
          </Button>
          <Button
            variant="destructive"
            onClick={() =>
              dispatch(
                openModal({ type: 'rejectSettlement', props: { slipId: slip.id } }),
              )
            }
          >
            Rejeter
          </Button>
        </div>
      </Card>

      <ConfirmValidationModal />
      <RejectSettlementModal />
    </PageShell>
  );
};
