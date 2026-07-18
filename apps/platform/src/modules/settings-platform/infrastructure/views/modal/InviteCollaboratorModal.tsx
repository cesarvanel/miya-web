import React, { useState } from 'react';
import { Button, Modal, TextField } from '@miya/ui';
import { PlatformUserRole } from '@/modules/auth';
import { usePlatformDispatch } from '@/config/root-hook';
import { useModal } from '@/shared/modals';
import { InviteCollaboratorAsync } from '../../../application/usecases/invite-collaborator-async/InviteCollaboratorAsync';

const ROLE_OPTIONS: { role: PlatformUserRole; label: string; description: string }[] = [
  { role: PlatformUserRole.ReadOnly, label: 'Lecture', description: 'Consulte banques, factures & activité, sans modifier.' },
  { role: PlatformUserRole.Owner, label: 'Complet', description: 'Suspend, édite les plans, enregistre les paiements.' },
];

/** Invitation d'un collaborateur — rôle en radio-cards avec description de chaque rôle. Maquette 5b. */
export const InviteCollaboratorModal: React.FC = () => {
  const { isOpen, close } = useModal('inviteCollaborator');
  const dispatch = usePlatformDispatch();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<PlatformUserRole>(PlatformUserRole.ReadOnly);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) {
    return null;
  }

  const canSubmit = fullName.trim() !== '' && email.trim() !== '';

  const reset = (): void => {
    setFullName('');
    setEmail('');
    setRole(PlatformUserRole.ReadOnly);
  };

  const handleClose = (): void => {
    reset();
    close();
  };

  const handleSubmit = async (): Promise<void> => {
    if (!canSubmit) {
      return;
    }
    setSubmitting(true);
    await dispatch(InviteCollaboratorAsync({ fullName, email, role }));
    setSubmitting(false);
    reset();
    close();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      ariaLabel="Inviter un collaborateur"
      width={540}
      header={
        <>
          <div className="text-lg font-extrabold text-ink">Inviter un collaborateur</div>
          <div className="mt-1 text-[12.5px] font-medium text-ink-muted">Accès à la console super admin Miya</div>
        </>
      }
      footer={
        <div className="flex gap-2.5">
          <Button variant="secondary" className="flex-1" onClick={handleClose}>
            Annuler
          </Button>
          <Button variant="primary" className="flex-[1.4]" loading={submitting} disabled={!canSubmit} onClick={handleSubmit}>
            Envoyer l&rsquo;invitation
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-3.5">
        <TextField label="Nom complet" value={fullName} onChange={setFullName} placeholder="Ex. Aline Nkeng" required />
        <TextField label="E-mail professionnel" value={email} onChange={setEmail} placeholder="prenom.nom@miya.cm" required />

        <div>
          <label className="mb-2 block text-[12.5px] font-bold text-ink">Rôle</label>
          <div className="grid grid-cols-2 gap-3">
            {ROLE_OPTIONS.map((option) => {
              const isSelected = option.role === role;
              return (
                <button
                  key={option.role}
                  type="button"
                  onClick={() => setRole(option.role)}
                  className={[
                    'cursor-pointer rounded-2xl border-[1.5px] p-3.5 text-left transition',
                    isSelected ? 'border-primary bg-primary-soft/40' : 'border-line bg-card hover:bg-cream-50',
                  ].join(' ')}
                >
                  <div className={['text-[13.5px] font-bold', isSelected ? 'text-primary' : 'text-ink'].join(' ')}>{option.label}</div>
                  <div className="mt-1 text-[11.5px] leading-[1.4] font-medium text-ink-faint">{option.description}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </Modal>
  );
};
