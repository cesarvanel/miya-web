import React from 'react';
import { Button, Card, InitialsAvatar, Skeleton } from '@miya/ui';
import { Money, PhoneNumber } from '@miya/kernel';
import { PageShell } from '@/shared/layout/PageShell';
import { CotisationCalendar } from '../composants/CotisationCalendar';
import { formatMonthLabel } from '../composants/formatClientTime';
import { OperationRow } from '../composants/OperationRow';
import { QrCardPreviewModal } from '../composants/QrCardPreviewModal';
import { regularityPercent } from '../composants/RegularityCell';
import { DeactivateClientModal } from '../modal/DeactivateClientModal';
import { EditUsualAmountModal } from '../modal/EditUsualAmountModal';
import { useClientDetail } from './useClientDetail';

/** Fiche client pleine page — identité, épargne, calendrier de cotisation, mouvements. Maquette 6/6d. */
export const ClientDetailPage: React.FC = () => {
  const {
    client,
    operationsByMonth,
    isPending,
    isQrPreviewOpen,
    openQrPreview,
    closeQrPreview,
    openEditUsualAmount,
    openDeactivate,
    goToWithdrawal,
  } = useClientDetail();

  if (!client) {
    return isPending ? (
      <Skeleton variant="card" />
    ) : (
      <div className="text-sm font-medium text-ink-muted">Client introuvable.</div>
    );
  }

  const clientSinceLabel = new Date(client.clientSince).toLocaleDateString('fr-FR', {
    month: 'long',
    year: 'numeric',
  });
  const months = Object.keys(operationsByMonth).sort().reverse();

  return (
    <PageShell
      title={client.fullName}
      subtitle={`Cliente depuis ${clientSinceLabel}`}
      back={{ label: 'Clients', to: '/clients' }}
      actions={
        <>
          <Button variant="secondary" onClick={openEditUsualAmount}>
            Modifier le montant habituel
          </Button>
          <Button variant="primary" onClick={openQrPreview}>
            Imprimer la carte QR
          </Button>
        </>
      }
    >
      {client.pendingWithdrawal && (
        <div className="mb-4.5 flex items-center gap-5.5 rounded-card-lg bg-[#16241E] p-6 text-white">
          <div className="flex size-13 flex-none items-center justify-center rounded-2xl bg-[#E5A93B]/18">
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
              <path d="M13 18V6m0 12l-4-4m4 4l4-4" stroke="#E5A93B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M6 21h14" stroke="#E5A93B" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-lg font-extrabold">Retrait en cours</div>
            <div className="mt-0.5 text-[13.5px] font-medium text-[#B9C4BE]">
              Demande validée · en attente de décaissement en agence.
            </div>
          </div>
          <div className="flex-none text-right">
            <div className="text-[12px] font-semibold text-[#9FB0A9]">Montant demandé</div>
            <div className="num text-[28px] leading-tight font-bold">
              {Money.from(client.pendingWithdrawal.amount).format()}
            </div>
          </div>
          <Button variant="primary" onClick={goToWithdrawal} className="flex-none">
            Voir le retrait
          </Button>
        </div>
      )}

      <div className="flex items-start gap-5.5">
        {/* LEFT column */}
        <div className="w-85 flex-none space-y-4">
          <Card className="text-center">
            <InitialsAvatar name={client.fullName} size="lg" />
            <div className="mt-3.5 text-lg font-extrabold text-ink">{client.fullName}</div>
            <div className="mt-0.5 text-[13px] font-medium text-ink-muted">
              {client.activity} · {client.zone}
            </div>
            <div className="bg-primary-soft mt-3 inline-flex items-center gap-1.75 rounded-full px-3.25 py-1.5">
              <span className="bg-primary size-2 rounded-full" />
              <span className="text-primary text-xs font-bold">
                {client.hasSmartphone ? 'Compte actif · à jour' : 'Compte actif · carte QR'}
              </span>
            </div>
          </Card>

          <Card>
            <div className="mb-3.5 text-xs font-extrabold text-ink">Coordonnées</div>
            <div className="flex items-center gap-2.75">
              <div className="flex size-8 flex-none items-center justify-center rounded-[9px] bg-cream-100">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path
                    d="M3 4h2l1 3-1.5 1a8 8 0 0 0 3 3l1-1.5 3 1v2a1 1 0 0 1-1 1C6 14 2 10 2 5a1 1 0 0 1 1-1z"
                    fill="#6B7069"
                  />
                </svg>
              </div>
              <div>
                <div className="num text-[13.5px] font-bold text-ink">{PhoneNumber.from(client.phone).formatInternational()}</div>
                <div className="text-[11.5px] font-medium text-ink-faint">
                  Mobile · {client.hasSmartphone ? 'vérifié' : 'sans smartphone'}
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="mb-3.5 flex items-center justify-between">
              <span className="text-xs font-extrabold text-ink">Pièce d'identité</span>
            </div>
            <div className="num text-[13.5px] font-bold text-ink">{client.idDocument.maskedNumber}</div>
            <div className="mt-3 border-t border-line-soft pt-3">
              <button
                type="button"
                onClick={openDeactivate}
                className="cursor-pointer text-[12.5px] font-bold text-danger hover:underline"
              >
                Désactiver ce client
              </button>
            </div>
          </Card>
        </div>

        {/* RIGHT column */}
        <div className="min-w-0 flex-1 space-y-4">
          <div className="flex gap-4">
            <div className="rounded-card-lg flex-[1.4] bg-primary-deep p-6 text-white">
              <div className="text-primary-bright text-[12.5px] font-bold tracking-[.06em] uppercase">
                Solde d'épargne
              </div>
              <div className="num mt-1.5 text-[42px] leading-tight font-bold tracking-[-0.02em]">
                {Money.from(client.savingsBalance).format()}
              </div>
              <div className="mt-2.5 flex gap-5">
                <div>
                  <div className="text-[11.5px] font-semibold text-primary-muted">Cotisation habituelle</div>
                  <div className="num text-[15px] font-bold">{Money.from(client.usualAmount).format()}</div>
                </div>
                <div>
                  <div className="text-[11.5px] font-semibold text-primary-muted">Plancher du plan</div>
                  <div className="num text-[15px] font-bold">{Money.from(client.plan.floorAmount).format()}</div>
                </div>
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-4">
              <Card>
                <div className="text-xs font-semibold text-ink-muted">Régularité</div>
                <div className="num text-primary mt-1 text-2xl font-bold">{regularityPercent(client.regularity)}%</div>
              </Card>
              <Card>
                <div className="text-xs font-semibold text-ink-muted">Agent collecteur</div>
                <div className="mt-1.5 text-[15px] font-bold text-ink">{client.assignedAgent.name}</div>
              </Card>
            </div>
          </div>

          <Card>
            <div className="mb-4 flex items-center justify-between">
              <span className="text-[15px] font-extrabold text-ink">Cotisations · cycle en cours</span>
              <span className="text-xs font-semibold text-ink-faint">
                {client.regularity.contributed} / {client.regularity.expected} jours cotisés
              </span>
            </div>
            <CotisationCalendar regularity={client.regularity} />
          </Card>

          <Card padding="none">
            <div className="border-b border-line-soft px-5 py-3.75 text-[15px] font-extrabold text-ink">
              Derniers mouvements
            </div>
            {months.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm font-medium text-ink-faint">Aucun mouvement.</div>
            ) : (
              months.map((month) => (
                <div key={month}>
                  <div className="bg-cream-50 px-5 py-2 text-[11px] font-bold tracking-[.03em] text-ink-faint uppercase">
                    {formatMonthLabel(month)}
                  </div>
                  {operationsByMonth[month]?.map((operation) => (
                    <OperationRow key={operation.id} operation={operation} />
                  ))}
                </div>
              ))
            )}
          </Card>
        </div>
      </div>

      <QrCardPreviewModal isOpen={isQrPreviewOpen} onClose={closeQrPreview} client={client} />
      <EditUsualAmountModal />
      <DeactivateClientModal />
    </PageShell>
  );
};
