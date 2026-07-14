import React, { useEffect, useState } from 'react';
import { Button, Dropdown } from '@miya/ui';
import { AgentRole, agentSelectors } from '@/modules/agents';
import { useBankDispatch, useBankSelector } from '@/config/stores/root-hook/RootHook';
import { ValidatorKind, type Validator, type ValidationChainEntry } from '../../../domain/entities/BankSettings';
import { UpdateValidationChainAsync } from '../../../application/usecases/update-validation-chain-async/UpdateValidationChainAsync';

interface ValidationChainCardProps {
  chains: ValidationChainEntry[];
}

const KIND_LABEL: Record<Validator['kind'], string> = {
  Holder: 'Titulaire',
  Substitute: 'Suppléant',
  Admin: 'Admin',
};

const KIND_CLASSES: Record<Validator['kind'], string> = {
  Holder: 'bg-primary-soft text-primary',
  Substitute: 'bg-[#EEE7F7] text-[#7A56A8]',
  Admin: 'bg-cream-100 text-ink-muted',
};

const initialsOf = (name: string): string =>
  name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

/** Chaîne de validation par agence — sélecteur d'agence + réordonnancement inline. Maquette 9h. */
export const ValidationChainCard: React.FC<ValidationChainCardProps> = ({ chains }) => {
  const dispatch = useBankDispatch();
  const [agencyId, setAgencyId] = useState(chains[0]?.agencyId ?? '');
  const [isEditing, setEditing] = useState(false);
  const [validators, setValidators] = useState<Validator[]>(chains.find((c) => c.agencyId === agencyId)?.validators ?? []);
  const [submitting, setSubmitting] = useState(false);

  const supervisors = useBankSelector(agentSelectors.selectAllAgents).filter((agent) => agent.role === AgentRole.Supervisor);
  const chain = chains.find((c) => c.agencyId === agencyId);

  useEffect(() => {
    setValidators(chain?.validators ?? []);
    setEditing(false);
  }, [agencyId, chain]);

  if (!chain) {
    return null;
  }

  const hasNoValidators = validators.length === 0;

  const move = (index: number, delta: number): void => {
    setValidators((current) => {
      const next = [...current];
      const target = index + delta;
      if (target < 0 || target >= next.length) {
        return current;
      }
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const remove = (id: string): void => {
    setValidators((current) => current.filter((v) => v.id !== id));
  };

  const addSupervisor = (supervisorId: string): void => {
    const supervisor = supervisors.find((agent) => agent.id === supervisorId);
    if (!supervisor || validators.some((v) => v.id === supervisor.id)) {
      return;
    }
    setValidators((current) => [
      ...current,
      { id: supervisor.id, name: supervisor.fullName, initials: initialsOf(supervisor.fullName), roleLabel: 'Responsable', kind: ValidatorKind.Substitute },
    ]);
  };

  const availableSupervisors = supervisors.filter((agent) => !validators.some((v) => v.id === agent.id));

  const save = async (): Promise<void> => {
    if (hasNoValidators) {
      return;
    }
    setSubmitting(true);
    await dispatch(UpdateValidationChainAsync({ agencyId: chain.agencyId, agencyName: chain.agencyName, validators }));
    setSubmitting(false);
    setEditing(false);
  };

  const cancel = (): void => {
    setValidators(chain.validators);
    setEditing(false);
  };

  return (
    <div id="settings-section-validation">
      <div className="mb-3.5 flex items-center gap-3">
        <span className="text-[12.5px] font-bold text-ink-muted">Agence</span>
        <Dropdown
          options={chains.map((c) => ({ value: c.agencyId, label: c.agencyName }))}
          value={agencyId}
          onChange={setAgencyId}
          aria-label="Agence"
        />
        <span className="text-[12px] font-medium text-ink-faint">Chaque agence a sa propre chaîne.</span>
      </div>

      <div className={['rounded-2xl border bg-card p-5', isEditing ? 'border-2 border-primary shadow-primary-glow' : 'border-line'].join(' ')}>
        <div className="mb-1 flex items-center justify-between">
          <span className="text-[16px] font-extrabold text-ink">Ordre des validateurs</span>
          {isEditing ? (
            <span className="bg-primary-soft rounded-full px-2.75 py-1 text-[11px] font-extrabold text-primary">En édition</span>
          ) : (
            <button type="button" onClick={() => setEditing(true)} className="cursor-pointer text-xs font-bold text-primary hover:underline">
              Modifier
            </button>
          )}
        </div>
        <div className="mb-4 text-[12.5px] font-medium text-ink-faint">
          {isEditing ? 'Réordonnez avec les flèches. Un reversement remonte la chaîne jusqu’à validation.' : 'Qui valide quoi, dans l’ordre.'}
        </div>

        <div className="flex flex-col gap-2">
          {validators.map((validator, index) => (
            <div key={validator.id} className="flex items-center gap-3.25 rounded-xl border border-line bg-card px-3.75 py-3">
              {isEditing && (
                <div className="flex flex-none flex-col gap-0.5">
                  <button type="button" disabled={index === 0} onClick={() => move(index, -1)} className="cursor-pointer disabled:cursor-not-allowed disabled:opacity-30">
                    <svg width="14" height="9" viewBox="0 0 14 9" fill="none" aria-hidden="true">
                      <path d="M3 6l4-4 4 4" stroke="#6B7069" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <button type="button" disabled={index === validators.length - 1} onClick={() => move(index, 1)} className="cursor-pointer disabled:cursor-not-allowed disabled:opacity-30">
                    <svg width="14" height="9" viewBox="0 0 14 9" fill="none" aria-hidden="true">
                      <path d="M3 3l4 4 4-4" stroke="#6B7069" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              )}
              <div className="num flex size-6.5 flex-none items-center justify-center rounded-lg bg-primary text-[13px] font-bold text-white">
                {index + 1}
              </div>
              <div className="bg-primary-soft text-primary flex size-9.5 flex-none items-center justify-center rounded-xl text-[13px] font-bold">
                {validator.initials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[14px] font-bold text-ink">{validator.name}</div>
                <div className="text-[12px] font-medium text-ink-faint">
                  {validator.roleLabel} · {KIND_LABEL[validator.kind].toLowerCase()}
                </div>
              </div>
              <span className={['flex-none rounded-full px-2.75 py-1 text-[11px] font-bold whitespace-nowrap', KIND_CLASSES[validator.kind]].join(' ')}>
                {KIND_LABEL[validator.kind]}
              </span>
              {isEditing && validator.kind !== ValidatorKind.Holder && (
                <button type="button" onClick={() => remove(validator.id)} className="flex-none cursor-pointer text-ink-faint hover:text-danger">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path d="M4 4l6 6M10 4l-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>

        {isEditing && availableSupervisors.length > 0 && (
          <Dropdown
            options={[{ value: '', label: 'Ajouter un suppléant…' }, ...availableSupervisors.map((agent) => ({ value: agent.id, label: agent.fullName }))]}
            value=""
            onChange={addSupervisor}
            aria-label="Ajouter un suppléant"
          />
        )}

        {hasNoValidators && (
          <div className="mt-3.5 flex items-start gap-2.25 rounded-xl border border-danger/30 bg-danger-soft px-3.5 py-3">
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true" className="mt-px flex-none">
              <path d="M9 2.5l5 2v3.5c0 3.2-2.2 4.8-5 5.5-2.8-.7-5-2.3-5-5.5V4.5l5-2z" stroke="#C43B32" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
            <span className="text-[12.5px] font-semibold text-danger">
              Chaque agence doit avoir au moins un validateur actif.
            </span>
          </div>
        )}

        {isEditing && (
          <div className="mt-4 flex justify-end gap-2.5">
            <Button variant="secondary" onClick={cancel}>
              Annuler
            </Button>
            <Button variant="primary" onClick={save} loading={submitting} disabled={hasNoValidators}>
              Enregistrer la chaîne
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
