import React, { useState } from 'react';
import { ConfirmDialog } from '@miya/ui';
import { useBankDispatch, useBankSelector } from '@/config/stores/root-hook/RootHook';
import { useModal } from '@/shared/modals';
import { RejectWithdrawalAsync } from '../../../application/usecases/reject-withdrawal-async/RejectWithdrawalAsync';
import { selectWithdrawalById } from '../../../domain/selectors/Selectors';

export const RejectWithdrawalModal: React.FC = () => {
  const { isOpen, props, close } = useModal('rejectWithdrawal');
  const dispatch = useBankDispatch();
  const withdrawal = useBankSelector((state) => (props ? selectWithdrawalById(state, props.withdrawalId) : undefined));
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !withdrawal) {
    return null;
  }

  const handleConfirm = async (reason?: string): Promise<void> => {
    if (!reason) {
      return;
    }
    setSubmitting(true);
    await dispatch(RejectWithdrawalAsync({ id: withdrawal.id, reason }));
    setSubmitting(false);
  };

  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={close}
      onConfirm={handleConfirm}
      title="Refuser cette demande"
      description={`${withdrawal.client.name} sera notifiée du refus de sa demande de retrait.`}
      confirmLabel="Refuser"
      tone="destructive"
      reasonLabel="Motif du refus"
      loading={submitting}
    />
  );
};
