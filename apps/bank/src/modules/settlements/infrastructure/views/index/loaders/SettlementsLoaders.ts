import type { LoaderFunction } from 'react-router-dom';
import type { BankStore } from '@/config/stores/store';
import { FetchSettlementQueueAsync } from '../../../../application/usecases/fetch-settlement-queue-async/FetchSettlementQueueAsync';

/** Déclenche le chargement (caché) de la file au montage du layout settlements. */
export const GetSettlementQueueLoader =
  (store: BankStore): LoaderFunction =>
  () => {
    store.dispatch(FetchSettlementQueueAsync({}));
    return null;
  };
