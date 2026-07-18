import React, { useState } from 'react';
import { Button, Modal } from '@miya/ui';
import { usePlatformDispatch, usePlatformSelector } from '@/config/root-hook';
import { useModal } from '@/shared/modals';
import { RevokeCollaboratorAsync } from '../../../application/usecases/revoke-collaborator-async/RevokeCollaboratorAsync';
import { isLastActiveOwner } from '../../../domain/entities/Collaborator';
import { selectCollaboratorById, selectCollaboratorsList } from '../../../domain/selectors/Selectors';

const REASON_PRESETS = ['Départ de l’équipe', 'Changement de fonction', 'Accès non conforme', 'Autre'];

/** Révocation — destructive, motif obligatoire, rappel que les sessions sont fermées immédiatement. Maquette 5a. */
export const RevokeCollaboratorModal: React.FC = () => {
  const { isOpen, props, close } = useModal('revokeCollaborator');
  const dispatch = usePlatformDispatch();
  const collaborator = usePlatformSelector((state) => (props ? selectCollaboratorById(state, props.collaboratorId) : undefined));
  const collaborators = usePlatformSelector(selectCollaboratorsList);
  const [preset, setPreset] = useState<string | null>(null);
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !collaborator) {
    return null;
  }

  const isLastOwner = isLastActiveOwner(collaborators, collaborator.id);
  const canSubmit = reason.trim() !== '' && !isLastOwner && !submitting;

  const reset = (): void => {
    setPreset(null);
    setReason('');
  };

  const handleClose = (): void => {
    reset();
    close();
  };

  const selectPreset = (label: string): void => {
    setPreset(label);
    if (label !== 'Autre') {
      setReason(label);
    } else {
      setReason('');
    }
  };

  const handleConfirm = async (): Promise<void> => {
    if (!canSubmit) {
      return;
    }
    setSubmitting(true);
    await dispatch(RevokeCollaboratorAsync({ collaboratorId: collaborator.id, reason }));
    setSubmitting(false);
    reset();
    close();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} ariaLabel={`Révoquer ${collaborator.fullName}`} width={480}>
      <div className="flex items-start gap-3.5">
        <div className="flex size-13 flex-none items-center justify-center rounded-[15px] bg-danger-soft">
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
            <path d="M13 3l11 19H2L13 3z" stroke="#C43B32" strokeWidth="2" strokeLinejoin="round" />
            <path d="M13 10v5M13 18.5h.01" stroke="#C43B32" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <div>
          <div className="text-lg font-extrabold tracking-[-0.01em] text-ink">Révoquer {collaborator.fullName} ?</div>
          <div className="mt-0.5 text-[12.5px] font-medium text-ink-muted">Ses sessions seront fermées immédiatement.</div>
        </div>
      </div>

      {isLastOwner ? (
        <div className="mt-4.5 rounded-[14px] bg-danger-soft px-4 py-3.5 text-[12.5px] leading-[1.5] font-semibold text-danger">
          Impossible : {collaborator.fullName} est le dernier compte Complet actif — la plateforme doit toujours en garder un.
        </div>
      ) : (
        <div className="mt-4.5">
          <label className="text-[12.5px] font-bold text-ink">
            Motif de la révocation <span className="text-danger">*</span>
          </label>
          <div className="mt-2 flex flex-wrap gap-1.75">
            {REASON_PRESETS.map((label) => (
              <button
                key={label}
                type="button"
                onClick={() => selectPreset(label)}
                className={[
                  'cursor-pointer rounded-full px-3.25 py-1.75 text-xs font-bold transition-colors',
                  preset === label ? 'bg-admin-sidebar text-white' : 'bg-cream-100 text-ink hover:bg-cream-50',
                ].join(' ')}
              >
                {label}
              </button>
            ))}
          </div>
          <textarea
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            rows={3}
            placeholder="Précisez le motif…"
            className="rounded-input focus-within:shadow-focus-ring mt-2.5 w-full border border-line bg-cream p-[13px] text-[13px] font-medium text-ink-muted outline-none placeholder:text-ink-soft"
          />
        </div>
      )}

      <div className="mt-5 flex gap-2.5">
        <Button variant="secondary" onClick={handleClose} className="flex-1">
          Annuler
        </Button>
        <Button variant="destructive" onClick={handleConfirm} loading={submitting} disabled={!canSubmit} className="flex-[1.4]">
          Révoquer l&rsquo;accès
        </Button>
      </div>
    </Modal>
  );
};
