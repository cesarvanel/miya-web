import React, { useEffect, useState } from 'react';
import { Button, Dropdown, Modal, TextField } from '@miya/ui';
import { AgentRole, agentSelectors } from '@/modules/settings';
import { useBankDispatch, useBankSelector } from '@/config/stores/root-hook/RootHook';
import { useModal } from '@/shared/modals';
import { AgenciesSelectors } from '../../../domain/selectors/Selectors';
import { CreateZoneAsync } from '../../../application/usecases/create-zone-async/CreateZoneAsync';

const UNASSIGNED = '';

export const CreateZoneModal: React.FC = () => {
  const { isOpen, props, close } = useModal('createZone');
  const dispatch = useBankDispatch();
  const agencies = useBankSelector(AgenciesSelectors.selectAllAgencies);
  const collectors = useBankSelector(agentSelectors.selectAllAgents).filter((agent) => agent.role === AgentRole.Collector);

  const [name, setName] = useState('');
  const [agencyId, setAgencyId] = useState(agencies[0]?.id ?? '');
  const [sector, setSector] = useState('');
  const [agentId, setAgentId] = useState(UNASSIGNED);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && props) {
      setAgencyId(props.agencyId);
    }
  }, [isOpen, props]);

  if (!isOpen) {
    return null;
  }

  const reset = (): void => {
    setName('');
    setSector('');
    setAgentId(UNASSIGNED);
  };

  const handleClose = (): void => {
    reset();
    close();
  };

  const submit = async (): Promise<void> => {
    if (!name.trim() || !agencyId) {
      return;
    }
    const agent = collectors.find((candidate) => candidate.id === agentId);
    setSubmitting(true);
    await dispatch(
      CreateZoneAsync({
        agencyId,
        name: name.trim(),
        sector: sector.trim(),
        assignedAgentId: agent?.id,
        assignedAgentName: agent?.fullName,
      }),
    );
    setSubmitting(false);
    reset();
    close();
  };

  const selectedAgencyName = agencies.find((agency) => agency.id === agencyId)?.name ?? '—';

  return (
    <Modal isOpen={isOpen} onClose={handleClose} ariaLabel="Nouvelle zone de collecte" width={520}>
      <div className="flex items-center gap-3">
        <div className="bg-primary-soft flex size-12 flex-none items-center justify-center rounded-[13px]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11z" stroke="#0A6B4E" strokeWidth="1.7" />
            <circle cx="12" cy="10" r="2.6" stroke="#0A6B4E" strokeWidth="1.7" />
          </svg>
        </div>
        <div>
          <div className="text-[19px] font-extrabold text-ink">Nouvelle zone de collecte</div>
          <div className="text-[13px] font-medium text-ink-muted">Rattachée à l&rsquo;agence {selectedAgencyName}</div>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-4">
        <TextField label="Nom de la zone" value={name} onChange={setName} required placeholder="Ex. Nkolbisson" />

        <div className="grid grid-cols-2 gap-3.5">
          <div>
            <div className="mb-1.75 text-xs font-bold text-ink">
              Agence <span className="text-danger">*</span>
            </div>
            <Dropdown
              options={agencies.map((agency) => ({ value: agency.id, label: agency.name }))}
              value={agencyId}
              onChange={setAgencyId}
              aria-label="Agence"
            />
          </div>
          <TextField label="Secteur" value={sector} onChange={setSector} placeholder="Ex. Ouest" />
        </div>

        <div>
          <div className="mb-1.75 text-xs font-bold text-ink">Agent à affecter</div>
          <Dropdown
            options={[{ value: UNASSIGNED, label: 'Non affecté' }, ...collectors.map((agent) => ({ value: agent.id, label: agent.fullName }))]}
            value={agentId}
            onChange={setAgentId}
            aria-label="Agent à affecter"
          />
        </div>

        <div className="flex items-start gap-2.25 rounded-xl bg-cream-100 px-3.5 py-3">
          <svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden="true" className="mt-px flex-none">
            <circle cx="8.5" cy="8.5" r="6.5" stroke="#6B7069" strokeWidth="1.3" />
            <path d="M8.5 7.8v3.4M8.5 5.4h.01" stroke="#6B7069" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          <span className="text-[12px] font-semibold leading-[1.45] text-ink-muted">
            Les clients seront affectés à cette zone lors de leur enregistrement ou par transfert depuis une zone voisine.
          </span>
        </div>
      </div>

      <div className="mt-5 flex gap-2.5">
        <Button variant="secondary" className="flex-1" onClick={handleClose}>
          Annuler
        </Button>
        <Button variant="primary" className="flex-[1.4]" loading={submitting} disabled={!name.trim() || !agencyId} onClick={submit}>
          <span className="flex items-center justify-center gap-2">
            <svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden="true">
              <path d="M8.5 3v11M3 8.5h11" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" />
            </svg>
            Créer la zone
          </span>
        </Button>
      </div>
    </Modal>
  );
};
