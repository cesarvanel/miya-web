import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ConfirmDialog } from '@miya/ui';
import { usePlatformDispatch } from '@/config/root-hook';
import { useModal } from '@/shared/modals';
import { LogoutAsync } from '../../../application/usecases/logout-async/LogoutAsync';
import { AuthRoutes } from '../../router/AuthRoutes';

/** Mounted globally — déclenchée depuis le menu utilisateur de la sidebar. */
export const ConfirmLogoutModal: React.FC = () => {
  const { isOpen, close } = useModal('confirmLogout');
  const dispatch = usePlatformDispatch();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleConfirm = async (): Promise<void> => {
    setSubmitting(true);
    await dispatch(LogoutAsync());
    setSubmitting(false);
    navigate(AuthRoutes.loginPath, { replace: true });
  };

  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={close}
      onConfirm={handleConfirm}
      title="Se déconnecter de la console éditeur ?"
      description="Vous reviendrez à l'écran de connexion. Les actions non enregistrées seront perdues."
      confirmLabel="Se déconnecter"
      tone="destructive"
      loading={submitting}
    />
  );
};
