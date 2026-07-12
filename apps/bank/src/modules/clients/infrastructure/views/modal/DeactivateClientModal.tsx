import React, { useState } from 'react';
import { ConfirmDialog } from '@miya/ui';
import { useBankDispatch, useBankSelector } from '@/config/stores/root-hook/RootHook';
import { useModal } from '@/shared/modals';
import { DeactivateClientAsync } from '../../../application/usecases/deactivate-client-async/DeactivateClientAsync';
import { selectClientById } from '../../../domain/selectors/Selectors';

export const DeactivateClientModal: React.FC = () => {
  const { isOpen, props, close } = useModal('deactivateClient');
  const dispatch = useBankDispatch();
  const client = useBankSelector((state) => (props ? selectClientById(state, props.clientId) : undefined));
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !client) {
    return null;
  }

  const handleConfirm = async (reason?: string): Promise<void> => {
    if (!reason) {
      return;
    }
    setSubmitting(true);
    await dispatch(DeactivateClientAsync({ id: client.id, reason }));
    setSubmitting(false);
  };

  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={close}
      onConfirm={handleConfirm}
      title="Désactiver ce client"
      description={`${client.fullName} ne pourra plus cotiser tant que le compte n'est pas réactivé. Cette action est tracée.`}
      confirmLabel="Désactiver"
      tone="destructive"
      reasonLabel="Motif de la désactivation"
      loading={submitting}
    />
  );
};
