import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ConfirmDialog } from '@miya/ui';
import { useBankDispatch } from '@/config/stores/root-hook/RootHook';
import { useModal } from '@/shared/modals';
import { LogoutAsync } from '../../../application/usecases/logout-async/LogoutAsync';
import { AuthRoutes } from '../../router/AuthRoutes';

/** Mounted globally — déclenchée depuis le menu utilisateur ET la page Mon profil. */
export const ConfirmLogoutModal: React.FC = () => {
  const { isOpen, close } = useModal('confirmLogout');
  const dispatch = useBankDispatch();
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
      title="Se déconnecter de Miya Banque ?"
      description="Vous reviendrez à l'écran de connexion. Les actions non enregistrées seront perdues."
      confirmLabel="Se déconnecter"
      tone="destructive"
      loading={submitting}
    />
  );
};
