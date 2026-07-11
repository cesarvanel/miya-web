import type { LoaderFunction } from 'react-router-dom';
import type { BankStore } from '@/config/stores/store';
import { FetchDaySummaryAsync } from '../../application/usecases/fetch-day-summary-async/FetchDaySummaryAsync';

/** Déclenche le chargement (caché) du résumé du jour au montage de la page. */
export const GetDaySummaryLoader =
  (store: BankStore): LoaderFunction =>
  () => {
    store.dispatch(FetchDaySummaryAsync({}));
    return null;
  };
