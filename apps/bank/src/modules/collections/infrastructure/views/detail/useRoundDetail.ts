import { useNavigate, useParams } from 'react-router-dom';
import { useFreshness, useRequestStatus } from '@miya/kernel';
import { useBankSelector } from '@/config/stores/root-hook/RootHook';
import { FetchRoundDetailAsync } from '../../../application/usecases/fetch-round-detail-async/FetchRoundDetailAsync';
import {
  selectRoundById,
  selectRoundKpis,
  selectStopsBreakdown,
  selectStopsByRound,
} from '../../../domain/selectors/Selectors';

export const useRoundDetail = () => {
  const { roundId = '' } = useParams<{ roundId: string }>();
  const navigate = useNavigate();

  const round = useBankSelector((state) => selectRoundById(state, roundId));
  const kpis = useBankSelector((state) => selectRoundKpis(state, roundId));
  const stopsByZone = useBankSelector((state) => selectStopsByRound(state, roundId));
  const breakdown = useBankSelector((state) => selectStopsBreakdown(state, roundId));
  const { isPending } = useRequestStatus(FetchRoundDetailAsync);

  const fetchedAt = useBankSelector(
    (state) => state.cache.entries[`collections:round:${roundId}`]?.fetchedAt ?? null,
  );
  const freshness = useFreshness(fetchedAt, isPending);

  const goToAgentDisputes = (): void => {
    if (!round) {
      return;
    }
    navigate(`/disputes?agentId=${round.agent.id}`);
  };

  return { round, kpis, stopsByZone, breakdown, isPending, freshness, goToAgentDisputes };
};
