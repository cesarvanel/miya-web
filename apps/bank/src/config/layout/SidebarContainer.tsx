import React, { useEffect } from 'react';
import { disputesSelectors, FetchDisputesAsync } from '@/modules/disputes';
import { FetchSettlementQueueAsync, settlementSelectors } from '@/modules/settlements';
import { FetchWithdrawalsAsync, withdrawalSelectors } from '@/modules/withdrawals';
import { useBankDispatch, useBankSelector } from '@/config/stores/root-hook/RootHook';
import { Sidebar, type SidebarBadge } from '@/shared/layout/Sidebar';

/**
 * Composition root : lit les compteurs (dérivés du state, donc temps réel)
 * dans l'index public de chaque module et les passe à la `Sidebar`, qui
 * reste un composant de layout pur — aucun accès store depuis `shared/`.
 */
export const SidebarContainer: React.FC = () => {
  const dispatch = useBankDispatch();
  const pendingSettlementsCount = useBankSelector(settlementSelectors.selectPendingCount);
  const openDisputesCount = useBankSelector(disputesSelectors.selectOpenCount);
  const pendingWithdrawalsCount = useBankSelector(withdrawalSelectors.selectPendingCount);

  useEffect(() => {
    // Les compteurs doivent être visibles dès l'entrée dans l'app, quelle que
    // soit la première route visitée — dédupliqué par le cache (createCachedAsyncThunk).
    dispatch(FetchSettlementQueueAsync({}));
    dispatch(FetchDisputesAsync({}));
    dispatch(FetchWithdrawalsAsync({}));
  }, [dispatch]);

  const badges: Partial<Record<string, SidebarBadge>> = {
    '/settlements': { count: pendingSettlementsCount, tone: 'amber' },
    '/disputes': { count: openDisputesCount, tone: 'red' },
    '/withdrawals': { count: pendingWithdrawalsCount, tone: 'amber' },
  };

  return (
    // TODO(auth): remettre `showAdministration` derrière le rôle bank_admin une fois l'auth branchée.
    <Sidebar badges={badges} showAdministration />
  );
};
