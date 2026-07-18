import React, { useState } from 'react';
import { Button, Modal, PasswordField, PasswordStrengthGauge } from '@miya/ui';
import { checkPasswordStrength } from '@miya/kernel';
import { usePlatformDispatch } from '@/config/root-hook';
import { useModal } from '@/shared/modals';
import { ChangePasswordAsync } from '../../../application/usecases/change-password-async/ChangePasswordAsync';

/** Changement de mot de passe — checklist de robustesse en temps réel, règles mutualisées (kernel). */
export const ChangePasswordModal: React.FC = () => {
  const { isOpen, close } = useModal('changePlatformPassword');
  const dispatch = usePlatformDispatch();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) {
    return null;
  }

  const strength = checkPasswordStrength(newPassword);
  const confirmMatches = confirmPassword.length > 0 && confirmPassword === newPassword;
  const canSubmit = currentPassword !== '' && strength.isValid && confirmMatches && !submitting;

  const reset = (): void => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleClose = (): void => {
    reset();
    close();
  };

  const submit = async (): Promise<void> => {
    if (!canSubmit) {
      return;
    }
    setSubmitting(true);
    const result = await dispatch(ChangePasswordAsync({ currentPassword, newPassword }));
    setSubmitting(false);
    if (ChangePasswordAsync.fulfilled.match(result)) {
      reset();
      close();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} ariaLabel="Changer le mot de passe" width={440}>
      <div className="text-lg font-extrabold text-ink">Changer le mot de passe</div>

      <div className="mt-4 flex flex-col gap-3.5">
        <PasswordField label="Mot de passe actuel" value={currentPassword} onChange={setCurrentPassword} required />
        <div>
          <PasswordField label="Nouveau mot de passe" value={newPassword} onChange={setNewPassword} required />
          <div className="mt-2.5">
            <PasswordStrengthGauge strength={strength} />
          </div>
        </div>
        <PasswordField
          label="Confirmer le mot de passe"
          value={confirmPassword}
          onChange={setConfirmPassword}
          required
          error={confirmPassword.length > 0 && !confirmMatches ? 'Les mots de passe ne correspondent pas.' : undefined}
        />
      </div>

      <div className="mt-5 flex justify-end gap-2.5">
        <Button variant="secondary" onClick={handleClose}>
          Annuler
        </Button>
        <Button variant="primary" onClick={submit} disabled={!canSubmit} loading={submitting}>
          Changer le mot de passe
        </Button>
      </div>
    </Modal>
  );
};
