import type { LoaderFunction } from 'react-router-dom';
import type { BankStore } from '@/config/stores/store';
import { FetchProfileAsync } from '../../../application/usecases/fetch-profile-async/FetchProfileAsync';

export const GetProfileLoader =
  (store: BankStore): LoaderFunction =>
  () => {
    store.dispatch(FetchProfileAsync({}));
    return null;
  };
