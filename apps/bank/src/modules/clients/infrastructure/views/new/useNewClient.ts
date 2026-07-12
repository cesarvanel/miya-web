import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PhoneNumber } from '@miya/kernel';
import { useBankDispatch } from '@/config/stores/root-hook/RootHook';
import { AGENTS_ROSTER } from '@/config/fixtures/AgentsRosterFixture';
import { ClientPlanFrequency } from '../../../domain/entities/Client';
import { CreateClientAsync } from '../../../application/usecases/create-client-async/CreateClientAsync';
import { ClientsRoutes } from '../../router/ClientsRoutes';

const FLOOR_AMOUNT = 500;
const CEILING_HINT = 5_000;

export const useNewClient = () => {
  const dispatch = useBankDispatch();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [cniNumber, setCniNumber] = useState('');
  const [activity, setActivity] = useState('');
  const [frequency, setFrequency] = useState<ClientPlanFrequency>(ClientPlanFrequency.Daily);
  const [usualAmount, setUsualAmount] = useState<number | null>(1_000);
  const [zone, setZone] = useState('');
  const [agentId, setAgentId] = useState('');
  const [hasSmartphone, setHasSmartphone] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const zones = Array.from(new Set(AGENTS_ROSTER.map((agent) => agent.zone))).sort();
  const selectedAgent = AGENTS_ROSTER.find((agent) => agent.agentId === agentId);

  const isBelowFloor = usualAmount !== null && usualAmount < FLOOR_AMOUNT;
  const canSubmit =
    fullName.trim() !== '' &&
    phone.length === 9 &&
    cniNumber.trim() !== '' &&
    activity.trim() !== '' &&
    usualAmount !== null &&
    !isBelowFloor &&
    zone !== '' &&
    agentId !== '' &&
    !submitting;

  const submit = async (): Promise<void> => {
    if (!canSubmit || !selectedAgent || usualAmount === null) {
      return;
    }
    setError(null);
    setSubmitting(true);
    const result = await dispatch(
      CreateClientAsync({
        identity: { fullName, phone, cniNumber, activity },
        plan: { frequency, floorAmount: FLOOR_AMOUNT },
        usualAmount,
        assignment: { zone, agentId: selectedAgent.agentId, agentName: selectedAgent.name },
        hasSmartphone,
      }),
    );
    setSubmitting(false);

    if (CreateClientAsync.fulfilled.match(result)) {
      navigate(ClientsRoutes.buildDetailPath(result.payload.client.id));
    } else if (CreateClientAsync.rejected.match(result)) {
      setError(result.payload?.message ?? 'Une erreur est survenue.');
    }
  };

  const cancel = (): void => {
    navigate(`/${ClientsRoutes.base}`);
  };

  return {
    fullName,
    setFullName,
    phone,
    setPhone,
    cniNumber,
    setCniNumber,
    activity,
    setActivity,
    frequency,
    setFrequency,
    usualAmount,
    setUsualAmount,
    isBelowFloor,
    floorAmount: FLOOR_AMOUNT,
    ceilingHint: CEILING_HINT,
    zone,
    setZone,
    zones,
    agentId,
    setAgentId,
    agents: AGENTS_ROSTER,
    selectedAgent,
    hasSmartphone,
    setHasSmartphone,
    canSubmit,
    submitting,
    error,
    submit,
    cancel,
    isPhoneValid: phone.length !== 9 || (() => {
      try {
        PhoneNumber.from(phone);
        return true;
      } catch {
        return false;
      }
    })(),
  };
};
