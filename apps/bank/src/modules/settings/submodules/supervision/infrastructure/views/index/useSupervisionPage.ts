import { useState } from 'react';
import { clientsSelectors } from '@/modules/clients';
import { disputesSelectors } from '@/modules/disputes';
import { useBankSelector } from '@/config/stores/root-hook/RootHook';
import { selectDaySnapshot, selectMonthSnapshot } from '../../../domain/selectors/Selectors';

export type SupervisionPeriod = 'day' | 'month';

const regularityRatio = (contributed: number, expected: number): number => (expected === 0 ? 1 : contributed / expected);

/**
 * KPIs réels (contestations, régularité, nouveaux clients) calculés en direct
 * depuis les modules clients/disputes déjà branchés ; le reste (tendance,
 * classement, rapprochements par agence) vient du snapshot seedé — pas
 * d'historique jour-par-jour ou multi-agence réel disponible ailleurs.
 */
export const useSupervisionPage = () => {
  const [period, setPeriod] = useState<SupervisionPeriod>('day');

  const day = useBankSelector(selectDaySnapshot);
  const month = useBankSelector(selectMonthSnapshot);

  const allDisputes = useBankSelector(disputesSelectors.selectAllDisputes);
  const openDisputesCount = useBankSelector(disputesSelectors.selectOpenCount);
  const resolvedDisputesCount = allDisputes.length - openDisputesCount;

  const allClients = useBankSelector(clientsSelectors.selectAllClients);
  const averageRegularityRate =
    allClients.length === 0
      ? 0
      : Math.round((allClients.reduce((sum, client) => sum + regularityRatio(client.regularity.contributed, client.regularity.expected), 0) / allClients.length) * 100);

  const currentMonthPrefix = new Date().toISOString().slice(0, 7);
  const newClientsThisMonth = allClients.filter((client) => client.clientSince.startsWith(currentMonthPrefix)).length;

  return {
    period,
    setPeriod,
    day,
    month,
    disputesCount: allDisputes.length,
    openDisputesCount,
    resolvedDisputesCount,
    averageRegularityRate,
    newClientsThisMonth,
  };
};
