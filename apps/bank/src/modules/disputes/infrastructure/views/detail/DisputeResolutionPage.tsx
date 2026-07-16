import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Skeleton, Textarea } from '@miya/ui';
import { Money } from '@miya/kernel';
import { PageShell } from '@/shared/layout/PageShell';
import { DisputeDecision } from '../../../domain/entities/Dispute';
import { selectDisputeGap } from '../../../domain/selectors/Selectors';
import { DisputeTrace } from '../composants/DisputeTrace';
import { formatAge, formatTime } from '../composants/formatDisputeTime';
import { ConfirmResolveDisputeModal } from '../modal/ConfirmResolveDisputeModal';
import { useDisputeResolution } from './useDisputeResolution';

/** Vue de résolution en pleine page — face-à-face, antécédents, décision. Maquette 3. */
export const DisputeResolutionPage: React.FC = () => {
  const { dispute, isPending, positionLabel, reason, setReason, canDecide, openConfirm, pendingSlipNumber } =
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

  if (isResolved && dispute.resolution) {
    const { resolution } = dispute;
    const isForClient = resolution.decidedInFavorOf === DisputeDecision.Client;
    const finalAmount = isForClient ? dispute.client.declaredAmount : dispute.agent.enteredAmount;

    return (
      <PageShell
        title={`${dispute.id} · ${dispute.client.name}`}
        subtitle="Clôturée · lecture seule"
        back={{ label: 'Contestations', to: '/disputes' }}
      >
        <div className="max-w-240">
          {/* Bandeau de résolution */}
          <div className="flex items-center gap-4 rounded-card-lg bg-primary p-5 text-white">
            <div className="animate-seal-pop flex size-13 flex-none items-center justify-center rounded-2xl bg-white/15">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                <path d="M8 14.5l4 4 8-9" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-lg font-extrabold">
                {isForClient ? 'Résolue en faveur du client' : "Résolue en faveur de l'agent"}
              </div>
              <div className="text-primary-tint mt-0.5 text-[13px] font-medium">
                Tranchée par {resolution.decidedBy} aujourd'hui à {formatTime(resolution.decidedAt)} · notifiée
                aux deux parties
              </div>
            </div>
            <div className="flex-none text-right">
              <div className="text-primary-tint text-[11.5px] font-semibold">
                Transaction {isForClient ? 'corrigée' : 'maintenue'}
              </div>
              <div className="num text-2xl font-bold">{Money.from(finalAmount).format()}</div>
            </div>
          </div>

          {/* Montants verrouillés */}
          <div className="mt-4.5 flex items-stretch gap-0">
            <Card
              className={[
                'flex-1 rounded-r-[6px]',
                !isForClient ? 'border-[1.5px] border-primary bg-primary-soft' : 'opacity-75',
              ].join(' ')}
            >
              <div
                className={[
                  'text-[11px] font-bold tracking-[.04em] uppercase',
                  !isForClient ? 'text-primary' : 'text-ink-faint',
                ].join(' ')}
              >
                {!isForClient ? 'Retenu · saisi par l’agent' : "Saisi par l'agent"}
              </div>
              <Link to={`/agents/${dispute.agent.id}`} className="mt-1 block text-sm font-bold text-ink hover:underline">
                {dispute.agent.name}
              </Link>
              <div
                className={[
                  'num mt-3.5 text-[34px] font-bold tracking-[-0.02em]',
                  !isForClient ? 'text-primary' : 'text-ink-disabled line-through',
                ].join(' ')}
              >
                {Money.from(dispute.agent.enteredAmount).format()}
              </div>
              <div className={['mt-1.5 text-[12.5px] font-semibold', !isForClient ? 'text-primary' : 'text-ink-faint'].join(' ')}>
                {!isForClient ? 'Montant définitif de la transaction' : 'Non retenu'}
              </div>
            </Card>
            <div className="z-10 -mx-3.5 flex w-14 flex-none items-center justify-center">
              <div className="shadow-primary-glow-sm flex size-14 items-center justify-center rounded-full border-4 border-cream bg-primary text-white">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M6 12.5l4 4 8-9" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
            <Card
              className={[
                'flex-1 rounded-l-[6px]',
                isForClient ? 'border-[1.5px] border-primary bg-primary-soft' : 'opacity-75',
              ].join(' ')}
            >
              <div
                className={[
                  'text-[11px] font-bold tracking-[.04em] uppercase',
                  isForClient ? 'text-primary' : 'text-ink-faint',
                ].join(' ')}
              >
                {isForClient ? 'Retenu · déclaré par le client' : 'Déclaré par le client'}
              </div>
              <Link to={`/clients/${dispute.client.id}`} className="mt-1 block text-sm font-bold text-ink hover:underline">
                {dispute.client.name}
              </Link>
              <div
                className={[
                  'num mt-3.5 text-[34px] font-bold tracking-[-0.02em]',
                  isForClient ? 'text-primary' : 'text-ink-disabled line-through',
                ].join(' ')}
              >
                {Money.from(dispute.client.declaredAmount).format()}
              </div>
              <div className={['mt-1.5 text-[12.5px] font-semibold', isForClient ? 'text-primary' : 'text-ink-faint'].join(' ')}>
                {isForClient ? 'Montant définitif de la transaction' : 'Non retenu'}
              </div>
            </Card>
          </div>

          {/* Trace + conséquences */}
          <div className="mt-4.5 flex items-start gap-4">
            <div className="flex-[1.4]">
              <DisputeTrace dispute={dispute} />
            </div>
            <div className="flex flex-1 flex-col gap-3">
              <Card>
                <div className="text-[11.5px] font-bold tracking-[.03em] text-ink-faint uppercase">Motif retenu</div>
                <div className="mt-1.5 text-[13px] leading-normal font-medium text-ink">{resolution.reason}</div>
              </Card>
              <Card>
                <div className="text-[11.5px] font-bold tracking-[.03em] text-ink-faint uppercase">
                  Impact reversement
                </div>
                {isForClient ? (
                  <>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[13px] font-semibold text-ink-muted">
                        Écart imputé à {dispute.agent.name}
                      </span>
                      <span className="num text-[15px] font-bold text-danger">
                        −{Money.from(Math.abs(gap)).format()}
                      </span>
                    </div>
                    {pendingSlipNumber && (
                      <div className="mt-1.5 flex items-center justify-between">
                        <span className="text-[13px] font-semibold text-ink-muted">Bordereau</span>
                        <span className="num text-[12.5px] font-bold text-ink">{pendingSlipNumber}</span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="mt-2 text-[13px] font-medium text-ink-muted">
                    Transaction maintenue — aucun impact sur le reversement.
                  </div>
                )}
              </Card>
              <div className="rounded-tile flex items-center gap-2.5 bg-cream-100 px-4 py-3.5">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                  <path d="M9 16s5.5-4 5.5-8A5.5 5.5 0 0 0 3.5 8c0 4 5.5 8 5.5 8z" stroke="#6B7069" strokeWidth="1.5" />
                  <path d="M6.5 8.5l1.8 1.8 3.2-3.6" stroke="#0A6B4E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-[12.5px] font-semibold text-ink-muted">
                  Client &amp; agent notifiés · quittance mise à jour
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2.75 rounded-tile bg-cream-100 px-4.5 py-3.5">
            <span className="text-[13px] font-semibold text-ink-muted">
              Dossier clôturé — <b className="font-bold text-ink">lecture seule</b>. La trace est conservée et
              exportable pour la supervision.
            </span>
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell
      title={`${dispute.id} · ${dispute.client.name}`}
      subtitle={`Écart de ${Money.from(Math.abs(gap)).format()} · zone ${dispute.zone}`}
      back={{ label: 'Contestations', to: '/disputes' }}
    >
      {positionLabel && (
        <div className="mb-4 flex justify-end">
          <span className="num rounded-full border border-line bg-card px-[13px] py-2 text-[12.5px] font-bold text-ink-muted">
            {positionLabel}
          </span>
        </div>
      )}

      <div className="max-w-240">
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

        <div className="flex items-stretch gap-0">
          <Card className="flex-1 rounded-r-[6px]">
            <div className="text-[11px] font-bold tracking-[.04em] text-ink-faint uppercase">
              Saisie de l'agent
            </div>
            <Link to={`/agents/${dispute.agent.id}`} className="mt-1 block text-sm font-bold text-ink hover:underline">
              {dispute.agent.name}
            </Link>
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
            <Link to={`/clients/${dispute.client.id}`} className="mt-1 block text-sm font-bold text-ink hover:underline">
              {dispute.client.name}
            </Link>
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

        <div className="mt-4.5 flex items-center gap-[11px] rounded-tile bg-cream-100 px-4 py-3.5">
          <span className="text-[13px] font-medium text-ink-muted">
            La résolution se fait{' '}
            <b className="font-bold text-ink">en présence de l'agent lors du reversement</b>. Votre décision est
            tracée et notifiée aux deux parties.
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
      </div>

      <ConfirmResolveDisputeModal />
    </PageShell>
  );
};
