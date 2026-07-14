import type { LoaderFunction } from 'react-router-dom';
import type { BankStore } from '@/config/stores/store';
import { FetchChangeLogAsync } from '../../../application/usecases/fetch-change-log-async/FetchChangeLogAsync';
import { FetchSettingsAsync } from '../../../application/usecases/fetch-settings-async/FetchSettingsAsync';

/** Déclenche le chargement (caché) des paramètres — utilisé par le hub (méta) et la page Configuration. */
export const GetSettingsLoader =
  (store: BankStore): LoaderFunction =>
  () => {
    store.dispatch(FetchSettingsAsync({}));
    store.dispatch(FetchChangeLogAsync({}));
    return null;
  };
