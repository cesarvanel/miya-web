import React from 'react';
import { Navigate, Outlet, useParams } from 'react-router-dom';
import { Card, EmptyState, Skeleton } from '@miya/ui';
import { PageShell } from '@/shared/layout/PageShell';
import { SettlementsRoutes } from '../../router/SettlementsRoutes';
import { ConfirmValidationModal } from '../modal/ConfirmValidationModal';
import { QueueItemCard } from '../composants/QueueItemCard';
import { RejectSettlementModal } from '../modal/RejectSettlementModal';
import { SuccessValidationModal } from '../modal/SuccessValidationModal';
import { useSettlements } from './useSettlements';

/**
 * Route index (`/settlements`, sans bordereau sélectionné) : sélectionne le
 * premier bordereau de la file automatiquement, comme sur la maquette où un
 * bordereau est toujours actif. Affiche l'état vide si la file est vide.
 */
export const SettlementsIndexRedirect: React.FC = () => {
  const { queue, isPending } = useSettlements();
  const [first] = queue;

  if (first) {
    return <Navigate to={SettlementsRoutes.buildDetailPath(first.id)} replace />;
  }
  if (isPending) {
    return <Skeleton variant="card" />;
  }
  return (
    <EmptyState
      title="File vide"
      description="Tous les reversements du jour sont validés."
    />
  );
};

/**
 * Layout des Reversements — file d'attente (gauche, toujours visible) +
 * bordereau sélectionné (droite, <Outlet/>), comme sur la maquette 2a : les
 * deux panneaux vivent sur la même page, seule la sélection change.
 */
export const SettlementQueuePage: React.FC = () => {
  const { queue, disputeCount, total, isPending } = useSettlements();
  const { id: selectedId } = useParams<{ id: string }>();

  return (
    <PageShell
      title="Reversements"
      subtitle="Vous comptez le cash, le système connaît le chiffre."
    >
      <div className="flex items-start gap-5.5">
        <Card padding="none" className="sticky top-0 w-95 flex-none">
          <div className="px-5 pt-4.5 pb-3.5">
            <div className="flex items-baseline justify-between">
              <div className="text-[17px] font-extrabold text-ink">
                File d'attente
              </div>
              {queue.length > 0 && (
                <span className="rounded-full bg-amber-soft px-2.75 py-1.25 text-[12.5px] font-bold text-amber">
                  {queue.length} à traiter
                </span>
              )}
            </div>
            <div className="mt-0.5 text-[13px] font-medium text-ink-muted">
              Traitez les bordereaux l'un après l'autre
            </div>
          </div>

          <div className="flex max-h-[65vh] flex-col gap-2.5 overflow-y-auto px-4">
            {isPending &&
              queue.length === 0 &&
              Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} variant="row" />
              ))}

            {!isPending && queue.length === 0 && (
              <EmptyState
                title="File vide"
                description="Tous les reversements du jour sont validés."
              />
            )}

            {queue.map((slip) => (
              <QueueItemCard
                key={slip.id}
                slip={slip}
                isSelected={slip.id === selectedId}
                disputeCount={disputeCount(slip.lines)}
              />
            ))}
          </div>

          <div className="rounded-tile m-4 flex items-center justify-between bg-cream-100 px-3.75 py-3.25">
            <span className="text-[13px] font-semibold text-ink-muted">
              Total en attente
            </span>
            <span className="num text-base font-bold text-ink">
              {total.format()}
            </span>
          </div>
        </Card>

        <div className="flex-1">
          <Outlet />
        </div>
      </div>

      <ConfirmValidationModal />
      <RejectSettlementModal />
      <SuccessValidationModal />
    </PageShell>
  );
};
