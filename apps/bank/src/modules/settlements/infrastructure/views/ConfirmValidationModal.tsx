import React, { useState } from 'react';
import { Button, Modal } from '@miya/ui';
import { Money } from '@miya/kernel';
import { useBankDispatch, useBankSelector } from '@/config/stores/root-hook/RootHook';
import { useModal } from '@/shared/modals';
import { ValidateSettlementAsync } from '../../application/usecases/ValidateSettlementAsync';
import { selectSlipById } from '../../domain/selectors/Selectors';

/** Confirmation avant validation croisée — montant système en évidence. */
export const ConfirmValidationModal: React.FC = () => {
  const { isOpen, props, close } = useModal('confirmValidation');
  const dispatch = useBankDispatch();
  const slip = useBankSelector((state) =>
    props ? selectSlipById(state, props.slipId) : undefined,
  );
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !slip) {
    return null;
  }

  const handleConfirm = async (): Promise<void> => {
    setSubmitting(true);
    await dispatch(ValidateSettlementAsync({ id: slip.id }));
    setSubmitting(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={close} ariaLabel="Confirmer la validation">
      <div className="text-lg font-extrabold text-ink">Valider le reversement</div>
      <div className="mt-1 text-sm font-medium text-ink-muted">
        Validation croisée avec {slip.agentName} · {slip.slipNumber}
      </div>

      <div className="rounded-card mt-[18px] bg-primary-deep px-[22px] py-5 text-white">
        <div className="text-[11px] font-bold tracking-[.06em] text-primary-bright uppercase">
          Montant à reverser
        </div>
        <div className="num mt-2 text-[34px] font-bold tracking-[-0.02em]">
          {Money.from(slip.expectedAmount).format()}
        </div>
      </div>

      <div className="rounded-tile mt-[14px] bg-primary-soft px-[13px] py-[11px] text-xs font-semibold text-primary">
        Comptez le cash physique et comparez au montant système avant de
        confirmer.
      </div>

      <div className="mt-4 flex gap-[10px]">
        <Button variant="secondary" onClick={close} className="flex-1">
          Annuler
        </Button>
        <Button
          variant="primary"
          onClick={handleConfirm}
          loading={submitting}
          className="flex-[1.4]"
        >
          Confirmer la validation
        </Button>
      </div>
    </Modal>
  );
};
