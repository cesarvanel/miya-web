import React, { useState } from 'react';
import { ConfirmDialog } from '@miya/ui';
import { useBankDispatch, useBankSelector } from '@/config/stores/root-hook/RootHook';
import { useModal } from '@/shared/modals';
import { SuspendAgentAsync } from '../../../application/usecases/suspend-agent-async/SuspendAgentAsync';
import { selectAgentById } from '../../../domain/selectors/Selectors';

export const SuspendAgentModal: React.FC = () => {
  const { isOpen, props, close } = useModal('suspendAgent');
  const dispatch = useBankDispatch();
  const agent = useBankSelector((state) => (props ? selectAgentById(state, props.agentId) : undefined));
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !agent) {
    return null;
  }

  const handleConfirm = async (reason?: string): Promise<void> => {
    if (!reason) {
      return;
    }
    setSubmitting(true);
    await dispatch(SuspendAgentAsync({ id: agent.id, reason }));
    setSubmitting(false);
  };

  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={close}
      onConfirm={handleConfirm}
      title="Suspendre cet agent"
      description={`${agent.fullName} ne pourra plus se connecter ni collecter tant que le compte n'est pas réactivé. Cette action est tracée.`}
      confirmLabel="Suspendre"
      tone="destructive"
      reasonLabel="Motif de la suspension"
      loading={submitting}
    />
  );
};
