import { useRequestStatus } from '@miya/kernel';
import { useBankSelector } from '@/config/stores/root-hook/RootHook';
import { FetchSettlementQueueAsync } from '@/modules/settlements/application/usecases/fetch-settlement-queue-async/FetchSettlementQueueAsync';
import type { SettlementLine } from '@/modules/settlements/domain/entities/SettlementSlip';
import {
  selectQueue,
  selectQueueTotal,
} from '@/modules/settlements/domain/selectors/Selectors';

export const useSettlements = () => {
  const queue = useBankSelector(selectQueue);
  const total = useBankSelector(selectQueueTotal);
  const { isPending } = useRequestStatus(FetchSettlementQueueAsync);

  return {
    queue,
    total,
    isPending,
    disputeCount: (lines: SettlementLine[]): number =>
      lines.filter((line) => line.status === 'disputed').length,
  };
};
