import React, { useEffect, useState } from 'react';
import { Button, Modal } from '@miya/ui';
import { PlatformUserRole } from '@/modules/auth';
import { usePlatformDispatch, usePlatformSelector } from '@/config/root-hook';
import { useModal } from '@/shared/modals';
import { ChangeCollaboratorRoleAsync } from '../../../application/usecases/change-collaborator-role-async/ChangeCollaboratorRoleAsync';
import { isLastActiveOwner } from '../../../domain/entities/Collaborator';
import { selectCollaboratorById, selectCollaboratorsList } from '../../../domain/selectors/Selectors';

const ROLE_OPTIONS: { role: PlatformUserRole; label: string; description: string }[] = [
  { role: PlatformUserRole.ReadOnly, label: 'Lecture', description: 'Consulte banques, factures & activité, sans modifier.' },
  { role: PlatformUserRole.Owner, label: 'Complet', description: 'Suspend, édite les plans, enregistre les paiements.' },
];

/** Changement de rôle — impact explicite, garde-fou visible avant même la confirmation. Maquette 5a. */
export const ChangeCollaboratorRoleModal: React.FC = () => {
  const { isOpen, props, close } = useModal('changeCollaboratorRole');
  const dispatch = usePlatformDispatch();
  const collaborator = usePlatformSelector((state) => (props ? selectCollaboratorById(state, props.collaboratorId) : undefined));
  const collaborators = usePlatformSelector(selectCollaboratorsList);
  const [role, setRole] = useState<PlatformUserRole>(PlatformUserRole.ReadOnly);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && collaborator) {
      setRole(collaborator.role);
    }
  }, [isOpen, collaborator]);

  if (!isOpen || !collaborator) {
    return null;
  }

  const wouldRemoveLastOwner = role === PlatformUserRole.ReadOnly && isLastActiveOwner(collaborators, collaborator.id);
  const hasChange = role !== collaborator.role;

  const handleClose = (): void => {
    close();
  };

  const handleConfirm = async (): Promise<void> => {
    if (!hasChange || wouldRemoveLastOwner || submitting) {
      return;
    }
    setSubmitting(true);
    await dispatch(ChangeCollaboratorRoleAsync({ collaboratorId: collaborator.id, newRole: role }));
    setSubmitting(false);
    close();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      ariaLabel={`Changer le rôle de ${collaborator.fullName}`}
      width={480}
      header={
        <>
          <div className="text-lg font-extrabold text-ink">Changer le rôle</div>
          <div className="mt-1 text-[12.5px] font-medium text-ink-muted">{collaborator.fullName}</div>
        </>
      }
      footer={
        <div className="flex gap-2.5">
          <Button variant="secondary" className="flex-1" onClick={handleClose}>
            Annuler
          </Button>
          <Button variant="primary" className="flex-[1.4]" loading={submitting} disabled={!hasChange || wouldRemoveLastOwner} onClick={handleConfirm}>
            Confirmer le changement
          </Button>
        </div>
      }
    >
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

      {wouldRemoveLastOwner && (
        <div className="mt-4 rounded-[14px] bg-danger-soft px-4 py-3.5 text-[12.5px] leading-[1.5] font-semibold text-danger">
          Impossible : {collaborator.fullName} est le dernier compte Complet actif — la plateforme doit toujours en garder un.
        </div>
      )}
    </Modal>
  );
};
