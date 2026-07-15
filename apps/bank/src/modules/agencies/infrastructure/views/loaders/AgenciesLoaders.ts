import type { LoaderFunction } from 'react-router-dom';
import { FetchAgentsAsync } from '@/modules/agents';
import type { BankStore } from '@/config/stores/store';
import { FetchAgenciesAsync } from '../../../application/usecases/fetch-agencies-async/FetchAgenciesAsync';

/** Agences/zones + roster des agents (picker « Agent à affecter »). */
export const GetAgenciesLoader =
  (store: BankStore): LoaderFunction =>
  () => {
    store.dispatch(FetchAgenciesAsync({}));
    store.dispatch(FetchAgentsAsync({}));
    return null;
  };
