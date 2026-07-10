import type { LoaderFunction } from 'react-router-dom';
import type { BankStore } from '@/config/stores/store';
import { FetchSettlementQueueAsync } from '../../../../application/usecases/fetch-settlement-queue-async/FetchSettlementQueueAsync';
import { FetchSlipAsync } from '../../../../application/usecases/FetchSlipAsync';

export const GetSettlementQueueLoader =
  (store: BankStore): LoaderFunction =>
  () => {
    store.dispatch(FetchSettlementQueueAsync({}));
    return null;
  };

export const GetSettlementSlipLoader =
  (store: BankStore): LoaderFunction =>
  ({ params }) => {
    const id = params.id;
    if (id) {
      store.dispatch(FetchSlipAsync({ id }));
    }
    return null;
  };
