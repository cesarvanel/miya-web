import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBankDispatch, useBankSelector } from '@/config/stores/root-hook/RootHook';
import { AgentRole } from '../../../domain/entities/Agent';
import { selectAllAgents } from '../../../domain/selectors/Selectors';
import { CreateAgentAsync } from '../../../application/usecases/create-agent-async/CreateAgentAsync';
import { AgentsRoutes } from '../../router/AgentsRoutes';

export const useNewAgent = () => {
  const dispatch = useBankDispatch();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [cniNumber, setCniNumber] = useState('');
  const [role, setRole] = useState<AgentRole>(AgentRole.Collector);
  const [supervisorId, setSupervisorId] = useState('');
  const [agency, setAgency] = useState('Agence Mokolo');
  const [zones, setZones] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const allAgents = useBankSelector(selectAllAgents);
  const supervisors = allAgents.filter((agent) => agent.role === AgentRole.Supervisor);
  const zoneOptions = Array.from(new Set(allAgents.flatMap((agent) => agent.zones))).sort();

  const isCollector = role === AgentRole.Collector;
  const canSubmit =
    fullName.trim() !== '' &&
    phone.length === 9 &&
    cniNumber.trim() !== '' &&
    agency.trim() !== '' &&
    zones.length > 0 &&
    (!isCollector || supervisorId !== '') &&
    !submitting;

  const submit = async (): Promise<void> => {
    if (!canSubmit) {
      return;
    }
    setError(null);
    setSubmitting(true);
    const result = await dispatch(
      CreateAgentAsync({
        identity: { fullName, phone, cniNumber },
        role,
        supervisorId: isCollector ? supervisorId : undefined,
        agency,
        zones,
      }),
    );
    setSubmitting(false);

    if (CreateAgentAsync.fulfilled.match(result)) {
      navigate(AgentsRoutes.buildDetailPath(result.payload.agent.id));
    } else if (CreateAgentAsync.rejected.match(result)) {
      setError(result.payload?.message ?? 'Une erreur est survenue.');
    }
  };

  const cancel = (): void => {
    navigate(`/${AgentsRoutes.base}`);
  };

  return {
    fullName,
    setFullName,
    phone,
    setPhone,
    cniNumber,
    setCniNumber,
    role,
    setRole,
    isCollector,
    supervisorId,
    setSupervisorId,
    supervisors,
    agency,
    setAgency,
    zones,
    setZones,
    zoneOptions,
    canSubmit,
    submitting,
    error,
    submit,
    cancel,
  };
};
