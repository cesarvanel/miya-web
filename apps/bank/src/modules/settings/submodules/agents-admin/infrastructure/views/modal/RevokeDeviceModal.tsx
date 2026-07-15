import React, { useState } from 'react';
import { ConfirmDialog } from '@miya/ui';
import { useBankDispatch, useBankSelector } from '@/config/stores/root-hook/RootHook';
import { useModal } from '@/shared/modals';
import { RevokeDeviceAsync } from '../../../application/usecases/revoke-device-async/RevokeDeviceAsync';
import { selectAgentById } from '../../../domain/selectors/Selectors';

export const RevokeDeviceModal: React.FC = () => {
  const { isOpen, props, close } = useModal('revokeDevice');
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
    await dispatch(RevokeDeviceAsync({ id: agent.id, reason }));
    setSubmitting(false);
  };

  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={close}
      onConfirm={handleConfirm}
      title="Révoquer l'appareil"
      description={
        <>
          {agent.device && (
            <span className="mb-3 block rounded-lg bg-cream-100 px-3 py-2.5 text-[12.5px] font-semibold text-ink">
              {agent.device.model} · {agent.device.os} · IMEI {agent.device.maskedImei}
            </span>
          )}
          <span className="mb-1.5 block">
            L&rsquo;agent ne pourra plus collecter tant qu&rsquo;un nouvel appareil n&rsquo;est pas lié — utilisez
            cette action en cas de vol ou perte du téléphone.
          </span>
        </>
      }
      confirmLabel="Révoquer l'appareil"
      tone="destructive"
      reasonLabel="Motif de la révocation"
      loading={submitting}
    />
  );
};
