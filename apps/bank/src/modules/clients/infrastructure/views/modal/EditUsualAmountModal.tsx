import React, { useState } from 'react';
import { AmountInput, Button, Modal } from '@miya/ui';
import { Money } from '@miya/kernel';
import { useBankDispatch, useBankSelector } from '@/config/stores/root-hook/RootHook';
import { useModal } from '@/shared/modals';
import { UpdateUsualAmountAsync } from '../../../application/usecases/update-usual-amount-async/UpdateUsualAmountAsync';
import { selectClientById } from '../../../domain/selectors/Selectors';

export const EditUsualAmountModal: React.FC = () => {
  const { isOpen, props, close } = useModal('editUsualAmount');
  const dispatch = useBankDispatch();
  const client = useBankSelector((state) => (props ? selectClientById(state, props.clientId) : undefined));
  const [amount, setAmount] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !client) {
    return null;
  }

  const currentAmount = amount ?? client.usualAmount;
  const isBelowFloor = currentAmount < client.plan.floorAmount;

  const handleClose = (): void => {
    setAmount(null);
    close();
  };

  const handleConfirm = async (): Promise<void> => {
    if (isBelowFloor) {
      return;
    }
    setSubmitting(true);
    await dispatch(UpdateUsualAmountAsync({ id: client.id, amount: currentAmount }));
    setSubmitting(false);
    setAmount(null);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} ariaLabel="Modifier le montant habituel">
      <div className="text-lg font-extrabold text-ink">Modifier le montant habituel</div>
      <div className="mt-1 text-sm font-medium text-ink-muted">{client.fullName}</div>

      <div className="mt-4.5">
        <label htmlFor="edit-usual-amount" className="mb-2 block text-[12.5px] font-bold text-ink">
          Nouveau montant
        </label>
        <AmountInput
          id="edit-usual-amount"
          value={amount ?? client.usualAmount}
          onChange={setAmount}
          error={isBelowFloor}
          aria-label="Nouveau montant habituel"
        />
        <div className="mt-1.5 text-[11.5px] font-semibold text-ink-faint">
          Plancher du plan : {Money.from(client.plan.floorAmount).format()}
        </div>
        {isBelowFloor && (
          <div className="mt-1.5 text-[11.5px] font-semibold text-danger">
            Le montant doit être supérieur ou égal au plancher.
          </div>
        )}
      </div>

      <div className="rounded-tile mt-4 bg-primary-soft px-[13px] py-[11px] text-xs font-semibold text-primary">
        Effectif dès la prochaine cotisation.
      </div>

      <div className="mt-4 flex gap-[10px]">
        <Button variant="secondary" onClick={handleClose} className="flex-1">
          Annuler
        </Button>
        <Button
          variant="primary"
          onClick={handleConfirm}
          loading={submitting}
          disabled={isBelowFloor}
          className="flex-[1.4]"
        >
          Enregistrer
        </Button>
      </div>
    </Modal>
  );
};
