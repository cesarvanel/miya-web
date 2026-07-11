import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useRequestStatus } from '@miya/kernel';
import { useBankSelector } from '@/config/stores/root-hook/RootHook';
import { FetchDisputesAsync } from '../../../application/usecases/fetch-disputes-async/FetchDisputesAsync';
import {
  selectOpenDisputes,
  selectResolvedDisputes,
} from '../../../domain/selectors/Selectors';
import { DisputesRoutes } from '../../router/DisputesRoutes';

export type DisputesTab = 'open' | 'resolved' | 'all';

/**
 * Logique de la page listing — onglets Ouvertes/Résolues/Toutes (maquette
 * 3a), tri par ancienneté, navigation vers la résolution, filtre optionnel
 * `?agentId=` (deep-link depuis le compteur de contestations d'une tournée).
 */
export const useDisputesList = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [tab, setTab] = useState<DisputesTab>('open');

  const agentFilter = searchParams.get('agentId');
  const openDisputesAll = useBankSelector(selectOpenDisputes);
  const resolvedDisputesAll = useBankSelector(selectResolvedDisputes);
  const { isPending } = useRequestStatus(FetchDisputesAsync);

  const openDisputes = agentFilter
    ? openDisputesAll.filter((dispute) => dispute.agent.id === agentFilter)
    : openDisputesAll;
  const resolvedDisputes = agentFilter
    ? resolvedDisputesAll.filter((dispute) => dispute.agent.id === agentFilter)
    : resolvedDisputesAll;

  const agentFilterName =
    agentFilter && [...openDisputesAll, ...resolvedDisputesAll].find((d) => d.agent.id === agentFilter)?.agent.name;

  const clearAgentFilter = (): void => setSearchParams({});

  const goToResolution = (id: string): void => {
    navigate(DisputesRoutes.buildDetailPath(id));
  };

  return {
    tab,
    setTab,
    openDisputes,
    resolvedDisputes,
    isPending,
    goToResolution,
    agentFilter,
    agentFilterName,
    clearAgentFilter,
  };
};
