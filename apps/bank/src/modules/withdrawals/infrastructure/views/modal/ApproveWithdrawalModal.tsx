import React, { useState } from 'react';
import { ConfirmDialog } from '@miya/ui';
import { Money } from '@miya/kernel';
import { useBankDispatch, useBankSelector } from '@/config/stores/root-hook/RootHook';
import { useModal } from '@/shared/modals';
import { ApproveWithdrawalAsync } from '../../../application/usecases/approve-withdrawal-async/ApproveWithdrawalAsync';
import { selectWithdrawalById } from '../../../domain/selectors/Selectors';

export const ApproveWithdrawalModal: React.FC = () => {
  const { isOpen, props, close } = useModal('approveWithdrawal');
  const dispatch = useBankDispatch();
  const withdrawal = useBankSelector((state) => (props ? selectWithdrawalById(state, props.withdrawalId) : undefined));
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !withdrawal) {
    return null;
  }

  const handleConfirm = async (): Promise<void> => {
    setSubmitting(true);
    await dispatch(ApproveWithdrawalAsync({ id: withdrawal.id }));
    setSubmitting(false);
  };

  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={close}
      onConfirm={handleConfirm}
      title="Valider cette demande"
      description={
        <>
          <span className="mb-2 block">{withdrawal.client.name} demande un retrait sur son épargne.</span>
          <span className="flex items-center justify-between rounded-lg bg-cream-100 px-3 py-2.5">
            <span className="font-semibold">Montant demandé</span>
            <span className="num font-bold text-ink">{Money.from(withdrawal.requestedAmount).format()}</span>
          </span>
          <span className="mt-1.5 flex items-center justify-between rounded-lg bg-cream-100 px-3 py-2.5">
            <span className="font-semibold">Solde disponible</span>
            <span className="num font-bold text-ink">{Money.from(withdrawal.availableBalance).format()}</span>
          </span>
        </>
      }
      confirmLabel="Valider"
      tone="default"
      loading={submitting}
    />
  );
};
