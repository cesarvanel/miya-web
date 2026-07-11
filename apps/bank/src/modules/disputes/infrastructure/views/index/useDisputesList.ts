import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRequestStatus } from '@miya/kernel';
import { useBankSelector } from '@/config/stores/root-hook/RootHook';
import { FetchDisputesAsync } from '../../../application/usecases/fetch-disputes-async/FetchDisputesAsync';
import {
  selectOpenDisputes,
  selectResolvedDisputes,
} from '../../../domain/selectors/Selectors';
import { DisputesRoutes } from '../../router/DisputesRoutes';

export type DisputesTab = 'open' | 'resolved';

/** Logique de la page listing — onglets Ouvertes/Résolues, tri par ancienneté, navigation vers la résolution. */
export const useDisputesList = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<DisputesTab>('open');

  const openDisputes = useBankSelector(selectOpenDisputes);
  const resolvedDisputes = useBankSelector(selectResolvedDisputes);
  const { isPending } = useRequestStatus(FetchDisputesAsync);

  const goToResolution = (id: string): void => {
    navigate(DisputesRoutes.buildDetailPath(id));
  };

  return {
    tab,
    setTab,
    openDisputes,
    resolvedDisputes,
    disputes: tab === 'open' ? openDisputes : resolvedDisputes,
    isPending,
    goToResolution,
  };
};
