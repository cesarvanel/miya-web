import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { agentSelectors, AgentRole } from '@/modules/settings';
import { useBankDispatch, useBankSelector } from '@/config/stores/root-hook/RootHook';
import { computeSavingsPlanComputed, computeEngagementEndDate } from '../../../domain/services/SavingsPlanCalculator';
import {
  DAY_OF_WEEK_ORDER,
  DayOfWeek,
  EngagementPreset,
  SAVINGS_PLAN_FLOOR_AMOUNT,
} from '../../../domain/entities/SavingsPlan';
import { CreateClientAsync } from '../../../application/usecases/create-client-async/CreateClientAsync';
import { ClientsRoutes } from '../../router/ClientsRoutes';

const CEILING_HINT = 5_000;

const todayIso = (): string => new Date().toISOString().slice(0, 10);

export type NewClientStep = 1 | 2;

export const useNewClient = () => {
  const dispatch = useBankDispatch();
  const navigate = useNavigate();

  const [step, setStep] = useState<NewClientStep>(1);

  // Étape 1 — Identité
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [cniNumber, setCniNumber] = useState('');
  const [activity, setActivity] = useState('');

  // Étape 2 — Plan d'épargne
  const [amountPerCollectionDay, setAmountPerCollectionDay] = useState<number | null>(1_000);
  const [collectionDays, setCollectionDays] = useState<DayOfWeek[]>([
    DayOfWeek.Monday,
    DayOfWeek.Tuesday,
    DayOfWeek.Wednesday,
    DayOfWeek.Thursday,
    DayOfWeek.Friday,
    DayOfWeek.Saturday,
  ]);
  const [preset, setPreset] = useState<EngagementPreset>(EngagementPreset.SixMonths);
  const [startDate, setStartDate] = useState(todayIso());
  const [customEndDate, setCustomEndDate] = useState('');
  const [openingDeposit, setOpeningDeposit] = useState<number | null>(null);

  // Étape 2 — Affectation
  const [zone, setZone] = useState('');
  const [agentId, setAgentId] = useState('');
  const [hasSmartphone, setHasSmartphone] = useState(true);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const collectors = useBankSelector(agentSelectors.selectAllAgents).filter(
    (agent) => agent.role === AgentRole.Collector,
  );
  const zones = Array.from(new Set(collectors.flatMap((agent) => agent.zones))).sort();
  const selectedAgent = collectors.find((agent) => agent.id === agentId);

  const endDate = preset === EngagementPreset.Custom ? customEndDate : computeEngagementEndDate(startDate, preset);

  const toggleDay = (day: DayOfWeek): void => {
    setCollectionDays((current) => (current.includes(day) ? current.filter((d) => d !== day) : [...current, day]));
  };
  const applyDaysPreset = (preset2: 'all' | 'exceptSunday' | 'weekly'): void => {
    if (preset2 === 'all') {
      setCollectionDays([...DAY_OF_WEEK_ORDER]);
    } else if (preset2 === 'exceptSunday') {
      setCollectionDays(DAY_OF_WEEK_ORDER.filter((d) => d !== DayOfWeek.Sunday));
    } else {
      setCollectionDays([DayOfWeek.Monday]);
    }
  };

  const computed = useMemo(
    () =>
      computeSavingsPlanComputed(
        amountPerCollectionDay ?? 0,
        collectionDays,
        startDate,
        endDate || startDate,
        openingDeposit ?? 0,
      ),
    [amountPerCollectionDay, collectionDays, startDate, endDate, openingDeposit],
  );

  const isBelowFloor = amountPerCollectionDay !== null && amountPerCollectionDay < SAVINGS_PLAN_FLOOR_AMOUNT;
  const hasNoDays = collectionDays.length === 0;
  const isEndDateValid = endDate !== '' && endDate > startDate;

  const canGoToStep2 = fullName.trim() !== '' && phone.length === 9 && cniNumber.trim() !== '' && activity.trim() !== '';
  const canSubmit =
    canGoToStep2 &&
    amountPerCollectionDay !== null &&
    !isBelowFloor &&
    !hasNoDays &&
    isEndDateValid &&
    zone !== '' &&
    agentId !== '' &&
    !submitting;

  const goToStep2 = (): void => {
    if (canGoToStep2) {
      setStep(2);
    }
  };
  const goToStep1 = (): void => setStep(1);

  const submit = async (): Promise<void> => {
    if (!canSubmit || !selectedAgent || amountPerCollectionDay === null) {
      return;
    }
    setError(null);
    setSubmitting(true);
    const result = await dispatch(
      CreateClientAsync({
        identity: { fullName, phone, cniNumber, activity },
        savingsPlan: {
          amountPerCollectionDay,
          collectionDays,
          startDate,
          endDate,
          preset,
          openingDeposit: openingDeposit ?? undefined,
        },
        assignment: { zone, agentId: selectedAgent.id, agentName: selectedAgent.fullName },
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
    step,
    goToStep1,
    goToStep2,
    canGoToStep2,
    fullName,
    setFullName,
    phone,
    setPhone,
    cniNumber,
    setCniNumber,
    activity,
    setActivity,
    amountPerCollectionDay,
    setAmountPerCollectionDay,
    isBelowFloor,
    floorAmount: SAVINGS_PLAN_FLOOR_AMOUNT,
    ceilingHint: CEILING_HINT,
    collectionDays,
    toggleDay,
    applyDaysPreset,
    hasNoDays,
    preset,
    setPreset,
    startDate,
    setStartDate,
    endDate,
    customEndDate,
    setCustomEndDate,
    isEndDateValid,
    openingDeposit,
    setOpeningDeposit,
    computed,
    zone,
    setZone,
    zones,
    agentId,
    setAgentId,
    agents: collectors,
    selectedAgent,
    hasSmartphone,
    setHasSmartphone,
    canSubmit,
    submitting,
    error,
    submit,
    cancel,
  };
};
