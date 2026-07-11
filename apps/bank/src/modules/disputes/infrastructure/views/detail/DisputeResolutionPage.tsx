import React from 'react';
import { Card, Skeleton, Textarea } from '@miya/ui';
import { Money } from '@miya/kernel';
import { PageShell } from '@/shared/layout/PageShell';
import { DisputeDecision } from '../../../domain/entities/Dispute';
import { selectDisputeGap } from '../../../domain/selectors/Selectors';
import { formatAge, formatTime } from '../composants/formatDisputeTime';
import { ConfirmResolveDisputeModal } from '../modal/ConfirmResolveDisputeModal';
import { useDisputeResolution } from './useDisputeResolution';

/** Vue de résolution en pleine page — face-à-face, antécédents, décision. Maquette 3/3b/3c. */
export const DisputeResolutionPage: React.FC = () => {
  const { dispute, isPending, positionLabel, reason, setReason, canDecide, openConfirm } =
    useDisputeResolution();

  if (!dispute) {
    return isPending ? (
      <Skeleton variant="card" />
    ) : (
      <div className="text-sm font-medium text-ink-muted">Contestation introuvable.</div>
    );
  }

  const gap = selectDisputeGap(dispute);
  const isResolved = dispute.status === 'Resolved';

  return (
    <PageShell
      title={`${dispute.id} · ${dispute.client.name}`}
      subtitle={
        isResolved
          ? 'Clôturée · lecture seule'
          : `Écart de ${Money.from(Math.abs(gap)).format()} · zone ${dispute.zone}`
      }
    >
      {!isResolved && positionLabel && (
        <div className="mb-4 flex justify-end">
          <span className="num rounded-full border border-line bg-card px-[13px] py-2 text-[12.5px] font-bold text-ink-muted">
            {positionLabel}
          </span>
        </div>
      )}

      <div className="max-w-240">
        {!isResolved && (
          <div className="mb-3 flex items-center gap-[11px]">
            <div className="flex items-center gap-2 rounded-full bg-amber-soft px-[14px] py-[7px]">
              <span className="size-2 animate-pulse-soft rounded-full bg-amber-strong" />
              <span className="text-xs font-extrabold tracking-[.03em] text-amber uppercase">
                En attente de résolution
              </span>
            </div>
            <span className="num text-[13px] font-semibold text-ink-muted">
              Ouverte {formatAge(dispute.openedAt)} · {formatTime(dispute.openedAt)}
            </span>
          </div>
        )}

        <div className="flex items-stretch gap-0">
          <Card className="flex-1 rounded-r-[6px]">
            <div className="text-[11px] font-bold tracking-[.04em] text-ink-faint uppercase">
              Saisie de l'agent
            </div>
            <div className="mt-1 text-sm font-bold text-ink">{dispute.agent.name}</div>
            <div className="num mt-4 text-[38px] font-bold tracking-[-0.02em] text-ink">
              {Money.from(dispute.agent.enteredAmount).format()}
            </div>
          </Card>
          <div className="z-10 -mx-3.5 flex w-14 flex-none items-center justify-center">
            <div className="shadow-danger-glow flex size-14 items-center justify-center rounded-full border-4 border-cream bg-danger text-sm font-extrabold text-white">
              VS
            </div>
          </div>
          <Card className="flex-1 rounded-l-[6px] border-danger/30 bg-danger-soft">
            <div className="text-[11px] font-bold tracking-[.04em] text-danger uppercase">
              Déclaration du client
            </div>
            <div className="mt-1 text-sm font-bold text-ink">{dispute.client.name}</div>
            <div className="num mt-4 text-[38px] font-bold tracking-[-0.02em] text-danger">
              {Money.from(dispute.client.declaredAmount).format()}
            </div>
            <div className="mt-1.5 text-[12.5px] font-medium text-danger-deep">
              Écart {Money.from(Math.abs(gap)).format()}
            </div>
          </Card>
        </div>

        <div className="mt-4.5 flex items-start gap-4">
          <Card className="flex-1">
            <div className="mb-3.5 text-[13px] font-extrabold text-ink">Antécédents du client</div>
            <div className="flex items-center justify-between border-b border-line-soft pb-3">
              <span className="text-[13px] font-medium text-ink-muted">Régularité</span>
              <span className="num text-sm font-bold text-primary">
                {dispute.clientHistory.regularity.onTime}/{dispute.clientHistory.regularity.total} j
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-line-soft py-3">
              <span className="text-[13px] font-medium text-ink-muted">Contestations (12 mois)</span>
              <span className="num text-sm font-bold text-ink">{dispute.clientHistory.disputesLast12Months}</span>
            </div>
            <div className="flex items-center justify-between pt-3">
              <span className="text-[13px] font-medium text-ink-muted">Client depuis</span>
              <span className="num text-sm font-bold text-ink">{dispute.clientHistory.clientSince}</span>
            </div>
          </Card>
          <Card className="flex-1">
            <div className="mb-3.5 text-[13px] font-extrabold text-ink">Antécédents de l'agent</div>
            <div className="flex items-center justify-between border-b border-line-soft pb-3">
              <span className="text-[13px] font-medium text-ink-muted">Taux de confirmation</span>
              <span className="num text-sm font-bold text-primary">
                {dispute.agentHistory.confirmationRate.toFixed(1).replace('.', ',')}%
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-line-soft py-3">
              <span className="text-[13px] font-medium text-ink-muted">Contestations (12 mois)</span>
              <span className="num text-sm font-bold text-amber">{dispute.agentHistory.disputesLast12Months}</span>
            </div>
            <div className="flex items-center justify-between pt-3">
              <span className="text-[13px] font-medium text-ink-muted">Écarts au reversement</span>
              <span className="num text-sm font-bold text-ink">{dispute.agentHistory.settlementGaps}</span>
            </div>
          </Card>
        </div>

        {isResolved && dispute.resolution ? (
          <Card className="mt-4.5">
            <div className="text-[13px] font-extrabold text-ink">
              Tranchée par {dispute.resolution.decidedBy}
              {' · '}
              {dispute.resolution.decidedInFavorOf === DisputeDecision.Client
                ? 'en faveur du client'
                : "en faveur de l'agent"}
            </div>
            <div className="mt-3 rounded-tile bg-cream-100 px-4 py-3.5">
              <div className="text-[11.5px] font-bold tracking-[.03em] text-ink-faint uppercase">
                Motif retenu
              </div>
              <div className="mt-1.5 text-[13px] font-medium text-ink">{dispute.resolution.reason}</div>
            </div>
          </Card>
        ) : (
          <>
            <div className="mt-4.5 flex items-center gap-[11px] rounded-tile bg-cream-100 px-4 py-3.5">
              <span className="text-[13px] font-medium text-ink-muted">
                La résolution se fait{' '}
                <b className="font-bold text-ink">en présence de l'agent lors du reversement</b>. Votre décision
                est tracée et notifiée aux deux parties.
              </span>
            </div>

            <div className="mt-4.5">
              <Textarea
                label="Motif de la décision"
                value={reason}
                onChange={setReason}
                required
                maxLength={300}
                placeholder="Ex. : le client a présenté son reçu SMS confirmant le montant…"
              />
            </div>

            <div className="mt-4 flex gap-3">
              <button
                type="button"
                disabled={!canDecide}
                onClick={() => openConfirm(DisputeDecision.Client)}
                className="shadow-danger-glow flex-1 cursor-pointer rounded-tile bg-danger px-[18px] py-[15px] text-center text-white transition disabled:cursor-not-allowed disabled:opacity-50"
              >
                <div className="text-[15.5px] font-bold">Trancher en faveur du client</div>
                <div className="mt-0.5 text-xs font-medium text-white/80">
                  Transaction corrigée à {Money.from(dispute.client.declaredAmount).format()}
                </div>
              </button>
              <button
                type="button"
                disabled={!canDecide}
                onClick={() => openConfirm(DisputeDecision.Agent)}
                className="flex-1 cursor-pointer rounded-tile border-[1.5px] border-primary bg-card px-[18px] py-[15px] text-center text-primary transition disabled:cursor-not-allowed disabled:opacity-50"
              >
                <div className="text-[15.5px] font-bold">Trancher en faveur de l'agent</div>
                <div className="mt-0.5 text-xs font-medium text-primary-muted">
                  Transaction maintenue à {Money.from(dispute.agent.enteredAmount).format()}
                </div>
              </button>
            </div>
          </>
        )}
      </div>

      <ConfirmResolveDisputeModal />
    </PageShell>
  );
};
