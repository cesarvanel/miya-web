import type { LoaderFunction } from 'react-router-dom';
import type { BankStore } from '@/config/stores/store';
import { FetchRoundDetailAsync } from '../../../application/usecases/fetch-round-detail-async/FetchRoundDetailAsync';
import { FetchRoundsAsync } from '../../../application/usecases/fetch-rounds-async/FetchRoundsAsync';

const today = (): string => new Date().toISOString().slice(0, 10);

/** Déclenche le chargement (caché) des tournées du jour au montage du listing. */
export const GetRoundsLoader =
  (store: BankStore): LoaderFunction =>
  () => {
    store.dispatch(FetchRoundsAsync({ date: today() }));
    return null;
  };

/** Déclenche le chargement (caché) du détail de la tournée sélectionnée. */
export const GetRoundDetailLoader =
  (store: BankStore): LoaderFunction =>
  ({ params }) => {
    const roundId = params.roundId;
    if (roundId) {
      store.dispatch(FetchRoundDetailAsync({ roundId }));
    }
    return null;
  };
