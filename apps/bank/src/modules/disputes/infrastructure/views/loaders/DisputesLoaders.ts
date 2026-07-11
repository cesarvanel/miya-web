import type { LoaderFunction } from 'react-router-dom';
import type { BankStore } from '@/config/stores/store';
import { FetchDisputesAsync } from '../../../application/usecases/fetch-disputes-async/FetchDisputesAsync';

/**
 * Déclenche le chargement (caché) de toutes les contestations — la même
 * collection alimente le listing ET la vue de résolution (le détail est
 * dérivé par id via un selector, pas de fetch séparé).
 */
export const GetDisputesLoader =
  (store: BankStore): LoaderFunction =>
  () => {
    store.dispatch(FetchDisputesAsync({}));
    return null;
  };
