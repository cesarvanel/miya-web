import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Modal } from '@miya/ui';
import { Money } from '@miya/kernel';
import { useBankDispatch, useBankSelector } from '@/config/stores/root-hook/RootHook';
import { useModal } from '@/shared/modals';
import { ResolveDisputeAsync } from '../../../application/usecases/resolve-dispute-async/ResolveDisputeAsync';
import { DisputeDecision } from '../../../domain/entities/Dispute';
import { selectDisputeById, selectDisputeGap } from '../../../domain/selectors/Selectors';
import { DisputesRoutes } from '../../router/DisputesRoutes';

export const ConfirmResolveDisputeModal: React.FC = () => {
  const { isOpen, props, close } = useModal('confirmResolveDispute');
  const dispatch = useBankDispatch();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const dispute = useBankSelector((state) =>
    props ? selectDisputeById(state, props.disputeId) : undefined,
  );

  if (!isOpen || !props || !dispute) {
    return null;
  }

  const { inFavorOf, reason } = props;
  const isForClient = inFavorOf === DisputeDecision.Client;
  const gap = Math.abs(selectDisputeGap(dispute));

  const handleConfirm = async (): Promise<void> => {
    setSubmitting(true);
    const result = await dispatch(
      ResolveDisputeAsync({ disputeId: dispute.id, inFavorOf, reason }),
    );
    setSubmitting(false);
    if (ResolveDisputeAsync.fulfilled.match(result)) {
      navigate(`/${DisputesRoutes.base}`);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={close}
      ariaLabel={isForClient ? 'Trancher en faveur du client' : "Trancher en faveur de l'agent"}
    >
      <div className="text-lg font-extrabold text-ink">
        {isForClient ? 'Trancher en faveur du client' : "Trancher en faveur de l'agent"}
      </div>
      <div className="mt-1 text-sm font-medium text-ink-muted">
        {dispute.id} · décision définitive
      </div>

      <div className="rounded-card mt-[18px] overflow-hidden border border-line bg-cream-100">
        {isForClient ? (
          <>
            <div className="flex items-center justify-between border-b border-line px-4 py-[13px]">
              <span className="text-[13px] font-semibold text-ink-muted">Transaction corrigée</span>
              <span className="num text-base font-bold text-primary">
                {Money.from(dispute.client.declaredAmount).format()}
              </span>
            </div>
            <div className="flex items-center justify-between px-4 py-[13px]">
              <span className="text-[13px] font-semibold text-ink-muted">
                Écart imputé à {dispute.agent.name}
              </span>
              <span className="num text-sm font-bold text-danger">
                −{Money.from(gap).format()}
              </span>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-between px-4 py-[13px]">
            <span className="text-[13px] font-semibold text-ink-muted">Transaction maintenue</span>
            <span className="num text-base font-bold text-primary">
              {Money.from(dispute.agent.enteredAmount).format()}
            </span>
          </div>
        )}
      </div>

      <div className="rounded-tile mt-[14px] bg-cream-100 px-[13px] py-[11px]">
        <div className="text-[11px] font-bold tracking-[.03em] text-ink-faint uppercase">Motif</div>
        <div className="mt-1 text-[13px] font-medium text-ink">{reason}</div>
      </div>

      <div className="rounded-tile mt-[14px] bg-amber-soft px-[13px] py-[11px] text-xs font-semibold text-amber-deep">
        Décision tracée et notifiée {isForClient ? 'au client et à l’agent' : 'à l’agent et au client'}.
        Action irréversible.
      </div>

      <div className="mt-4 flex gap-[10px]">
        <Button variant="secondary" onClick={close} className="flex-1">
          Annuler
        </Button>
        <Button
          variant="destructive"
          onClick={handleConfirm}
          loading={submitting}
          className="flex-[1.4]"
        >
          Confirmer la décision
        </Button>
      </div>
    </Modal>
  );
};
