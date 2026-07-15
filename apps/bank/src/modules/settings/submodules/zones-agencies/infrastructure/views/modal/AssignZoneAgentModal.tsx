import React, { useEffect, useState } from 'react';
import { Button, Dropdown, Modal } from '@miya/ui';
import { AgentRole, agentSelectors } from '@/modules/settings';
import { useBankDispatch, useBankSelector } from '@/config/stores/root-hook/RootHook';
import { useModal } from '@/shared/modals';
import { selectZoneById } from '../../../domain/selectors/Selectors';
import { AssignZoneAgentAsync } from '../../../application/usecases/assign-zone-agent-async/AssignZoneAgentAsync';

export const AssignZoneAgentModal: React.FC = () => {
  const { isOpen, props, close } = useModal('assignZoneAgent');
  const dispatch = useBankDispatch();
  const zone = useBankSelector((state) => (props ? selectZoneById(state, props.zoneId) : undefined));
  const collectors = useBankSelector(agentSelectors.selectAllAgents).filter((agent) => agent.role === AgentRole.Collector);

  const [agentId, setAgentId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && zone) {
      setAgentId(zone.assignedAgentId ?? '');
    }
  }, [isOpen, zone]);

  if (!isOpen || !zone) {
    return null;
  }

  const submit = async (): Promise<void> => {
    const agent = collectors.find((candidate) => candidate.id === agentId);
    if (!agent) {
      return;
    }
    setSubmitting(true);
    await dispatch(AssignZoneAgentAsync({ zoneId: zone.id, agentId: agent.id, agentName: agent.fullName }));
    setSubmitting(false);
    close();
  };

  return (
    <Modal isOpen={isOpen} onClose={close} ariaLabel="Affecter un agent" width={440}>
      <div className="text-lg font-extrabold text-ink">Affecter un agent</div>
      <div className="mt-1 text-[12.5px] font-medium text-ink-muted">Zone « {zone.name} »</div>

      <div className="mt-5">
        <div className="mb-1.75 text-xs font-bold text-ink">Agent collecteur</div>
        <Dropdown
          options={[{ value: '', label: 'Choisir un agent…' }, ...collectors.map((agent) => ({ value: agent.id, label: agent.fullName }))]}
          value={agentId}
          onChange={setAgentId}
          aria-label="Agent collecteur"
        />
      </div>

      <div className="mt-5 flex gap-2.5">
        <Button variant="secondary" className="flex-1" onClick={close}>
          Annuler
        </Button>
        <Button variant="primary" className="flex-[1.4]" loading={submitting} disabled={!agentId} onClick={submit}>
          Affecter
        </Button>
      </div>
    </Modal>
  );
};
