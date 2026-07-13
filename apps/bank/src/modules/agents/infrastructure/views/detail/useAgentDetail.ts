import { useParams, useNavigate } from 'react-router-dom';
import { useRequestStatus } from '@miya/kernel';
import { collectionsSelectors, RoundStatus } from '@/modules/collections';
import { settlementSelectors } from '@/modules/settlements';
import { useBankDispatch, useBankSelector } from '@/config/stores/root-hook/RootHook';
import { openModal } from '@/shared/modals';
import { selectAgentById, selectDayRecordsByAgent } from '../../../domain/selectors/Selectors';
import { FetchAgentAsync } from '../../../application/usecases/fetch-agent-async/FetchAgentAsync';
import { FetchAgentDayRecordsAsync } from '../../../application/usecases/fetch-agent-day-records-async/FetchAgentDayRecordsAsync';

export const useAgentDetail = () => {
  const { id = '' } = useParams<{ id: string }>();
  const dispatch = useBankDispatch();
  const navigate = useNavigate();

  const agent = useBankSelector((state) => selectAgentById(state, id));
  const dayRecords = useBankSelector((state) => selectDayRecordsByAgent(state, id));
  const { isPending } = useRequestStatus(FetchAgentAsync);
  const { isPending: isDayRecordsPending } = useRequestStatus(FetchAgentDayRecordsAsync);

  const pendingSlip = useBankSelector((state) => settlementSelectors.selectPendingSlipByAgentId(state, id));
  const todayRound = useBankSelector((state) => collectionsSelectors.selectRoundById(state, id));
  const hasOpenRoundToday = todayRound?.status === RoundStatus.Open;

  const openRevokeDevice = (): void => {
    dispatch(openModal({ type: 'revokeDevice', props: { agentId: id } }));
  };
  const openActivationCode = (): void => {
    dispatch(openModal({ type: 'activationCode', props: { agentId: id } }));
  };
  const openSuspend = (): void => {
    dispatch(openModal({ type: 'suspendAgent', props: { agentId: id } }));
  };
  const openReactivate = (): void => {
    dispatch(openModal({ type: 'confirmReactivate', props: { agentId: id } }));
  };
  const goToPendingSlip = (): void => {
    if (pendingSlip) {
      navigate(`/settlements/${pendingSlip.id}`);
    }
  };
  const goToTodayRound = (): void => {
    if (hasOpenRoundToday) {
      navigate(`/collections/${id}`);
    }
  };

  return {
    agent,
    dayRecords,
    isPending,
    isDayRecordsPending,
    pendingSlip,
    hasOpenRoundToday,
    openRevokeDevice,
    openActivationCode,
    openSuspend,
    openReactivate,
    goToPendingSlip,
    goToTodayRound,
  };
};
