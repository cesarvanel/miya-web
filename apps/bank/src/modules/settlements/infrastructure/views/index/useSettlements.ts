import { useBankSelector } from '@/config/stores/root-hook/RootHook';
import { SettlementLine } from '@/modules/settlements';
import { FetchSettlementQueueAsync } from '@/modules/settlements/application/usecases/fetch-settlement-queue-async/FetchSettlementQueueAsync';
import {
  selectQueue,
  selectQueueTotal,
} from '@/modules/settlements/domain/selectors/Selectors';
import { useRequestStatus } from '@miya/kernel';

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
