import type { LoaderFunction } from 'react-router-dom';
import type { BankStore } from '@/config/stores/store';
import { FetchSupervisionAsync } from '../../../application/usecases/fetch-supervision-async/FetchSupervisionAsync';

export const GetSupervisionLoader =
  (store: BankStore): LoaderFunction =>
  () => {
    store.dispatch(FetchSupervisionAsync({}));
    return null;
  };
