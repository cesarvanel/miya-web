import type { LoaderFunction } from 'react-router-dom';
import type { BankStore } from '@/config/stores/store';
import { FetchWithdrawalsAsync } from '../../../application/usecases/fetch-withdrawals-async/FetchWithdrawalsAsync';

/** Déclenche le chargement (caché) de la file des retraits. */
export const GetWithdrawalsLoader =
  (store: BankStore): LoaderFunction =>
  () => {
    store.dispatch(FetchWithdrawalsAsync({}));
    return null;
  };
