import React, { useState } from 'react';
import { ConfirmDialog } from '@miya/ui';
import { usePlatformDispatch, usePlatformSelector } from '@/config/root-hook';
import { useModal } from '@/shared/modals';
import { ResendInvitationAsync } from '../../../application/usecases/resend-invitation-async/ResendInvitationAsync';
import { selectCollaboratorById } from '../../../domain/selectors/Selectors';

export const ConfirmResendInvitationModal: React.FC = () => {
  const { isOpen, props, close } = useModal('confirmResendCollaboratorInvitation');
  const dispatch = usePlatformDispatch();
  const collaborator = usePlatformSelector((state) => (props ? selectCollaboratorById(state, props.collaboratorId) : undefined));
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !collaborator) {
    return null;
  }

  const handleConfirm = async (): Promise<void> => {
    setSubmitting(true);
    await dispatch(ResendInvitationAsync({ collaboratorId: collaborator.id }));
    setSubmitting(false);
    close();
  };

  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={close}
      onConfirm={handleConfirm}
      loading={submitting}
      title={`Renvoyer l'invitation à ${collaborator.fullName} ?`}
      confirmLabel="Renvoyer l'invitation"
      description={
        <>
          Un nouvel e-mail d&rsquo;invitation sera envoyé à <b className="text-ink">{collaborator.email}</b>.
        </>
      }
    />
  );
};
