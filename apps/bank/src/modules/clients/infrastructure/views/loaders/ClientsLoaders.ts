import type { LoaderFunction } from 'react-router-dom';
import type { BankStore } from '@/config/stores/store';
import { FetchClientAsync } from '../../../application/usecases/fetch-client-async/FetchClientAsync';
import { FetchClientOperationsAsync } from '../../../application/usecases/fetch-client-operations-async/FetchClientOperationsAsync';
import { FetchClientsAsync } from '../../../application/usecases/fetch-clients-async/FetchClientsAsync';

/** Déclenche le chargement (caché) du listing des clients. */
export const GetClientsLoader =
  (store: BankStore): LoaderFunction =>
  () => {
    store.dispatch(FetchClientsAsync({}));
    return null;
  };

/** Déclenche le chargement (caché) de la fiche client et de ses mouvements. */
export const GetClientDetailLoader =
  (store: BankStore): LoaderFunction =>
  ({ params }) => {
    const id = params.id;
    if (id) {
      store.dispatch(FetchClientAsync({ id }));
      store.dispatch(FetchClientOperationsAsync({ clientId: id }));
    }
    return null;
  };
