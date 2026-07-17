import React, { useState } from 'react';
import { ConfirmDialog } from '@miya/ui';
import { usePlatformDispatch, usePlatformSelector } from '@/config/root-hook';
import { useModal } from '@/shared/modals';
import { ResendInvitationAsync } from '../../../application/usecases/resend-invitation-async/ResendInvitationAsync';
import { selectTenantById } from '../../../domain/selectors/Selectors';

const maskEmail = (email: string): string => {
  const [local, domain] = email.split('@');
  if (!domain) {
    return `${email.slice(0, 2)}•••`;
  }
  const dotIndex = local.indexOf('.');
  const kept = dotIndex >= 0 ? local.slice(0, dotIndex + 1) : local.slice(0, 1);
  return `${kept}•••@${domain}`;
};

export const ResendInvitationModal: React.FC = () => {
  const { isOpen, props, close } = useModal('resendInvitation');
  const dispatch = usePlatformDispatch();
  const tenant = usePlatformSelector((state) => (props ? selectTenantById(state, props.tenantId) : undefined));
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !tenant) {
    return null;
  }

  const handleConfirm = async (): Promise<void> => {
    setSubmitting(true);
    await dispatch(ResendInvitationAsync({ tenantId: tenant.id }));
    setSubmitting(false);
    close();
  };

  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={close}
      onConfirm={handleConfirm}
      title="Renvoyer l'invitation ?"
      description={`Un nouvel e-mail d'activation sera envoyé à ${maskEmail(tenant.adminContact.email)}.`}
      confirmLabel="Renvoyer"
      loading={submitting}
    />
  );
};
