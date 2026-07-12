import { useNavigate, useParams } from 'react-router-dom';
import { useFreshness, useRequestStatus } from '@miya/kernel';
import { settlementSelectors } from '@/modules/settlements';
import { useBankSelector } from '@/config/stores/root-hook/RootHook';
import { FetchRoundDetailAsync } from '../../../application/usecases/fetch-round-detail-async/FetchRoundDetailAsync';
import {
  selectCollectedBreakdown,
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
  const collectedBreakdown = useBankSelector((state) => selectCollectedBreakdown(state, roundId));
  const pendingSlip = useBankSelector((state) =>
    round ? settlementSelectors.selectPendingSlipByAgentId(state, round.agent.id) : undefined,
  );
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

  const goToSlip = (): void => {
    if (!pendingSlip) {
      return;
    }
    navigate(`/settlements/${pendingSlip.id}`);
  };

  return {
    round,
    kpis,
    stopsByZone,
    breakdown,
    collectedBreakdown,
    pendingSlip,
    isPending,
    freshness,
    goToAgentDisputes,
    goToSlip,
  };
};
