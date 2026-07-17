import React, { useState } from 'react';
import { ConfirmDialog } from '@miya/ui';
import { usePlatformDispatch, usePlatformSelector } from '@/config/root-hook';
import { useModal } from '@/shared/modals';
import { ReactivateTenantAsync } from '../../../application/usecases/reactivate-tenant-async/ReactivateTenantAsync';
import { selectTenantById } from '../../../domain/selectors/Selectors';

export const ConfirmReactivateModal: React.FC = () => {
  const { isOpen, props, close } = useModal('confirmReactivateTenant');
  const dispatch = usePlatformDispatch();
  const tenant = usePlatformSelector((state) => (props ? selectTenantById(state, props.tenantId) : undefined));
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !tenant) {
    return null;
  }

  const handleConfirm = async (): Promise<void> => {
    setSubmitting(true);
    await dispatch(ReactivateTenantAsync({ tenantId: tenant.id }));
    setSubmitting(false);
    close();
  };

  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={close}
      onConfirm={handleConfirm}
      title={`Réactiver ${tenant.name} ?`}
      description="L'accès est restauré immédiatement — agents, clients et historique reprennent à l'identique."
      confirmLabel="Réactiver la banque"
      loading={submitting}
    />
  );
};
