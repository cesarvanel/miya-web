import React, { useState } from 'react';
import { ConfirmDialog } from '@miya/ui';
import { useBankDispatch, useBankSelector } from '@/config/stores/root-hook/RootHook';
import { useModal } from '@/shared/modals';
import { ReactivateAgentAsync } from '../../../application/usecases/reactivate-agent-async/ReactivateAgentAsync';
import { selectAgentById } from '../../../domain/selectors/Selectors';

export const ConfirmReactivateModal: React.FC = () => {
  const { isOpen, props, close } = useModal('confirmReactivate');
  const dispatch = useBankDispatch();
  const agent = useBankSelector((state) => (props ? selectAgentById(state, props.agentId) : undefined));
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !agent) {
    return null;
  }

  const handleConfirm = async (): Promise<void> => {
    setSubmitting(true);
    await dispatch(ReactivateAgentAsync({ id: agent.id }));
    setSubmitting(false);
  };

  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={close}
      onConfirm={handleConfirm}
      title="Réactiver cet agent"
      description={`${agent.fullName} pourra de nouveau se connecter et collecter dès la réactivation.`}
      confirmLabel="Réactiver"
      tone="default"
      loading={submitting}
    />
  );
};
