import type { LoaderFunction } from 'react-router-dom';
import type { BankStore } from '@/config/stores/store';
import { FetchSlipAsync } from '../../../../application/usecases/fetch-slip-async/FetchSlipAsync';

/** Déclenche le chargement (caché) du bordereau sélectionné au montage du panneau détail. */
export const GetSettlementSlipLoader =
  (store: BankStore): LoaderFunction =>
  ({ params }) => {
    const id = params.id;
    if (id) {
      store.dispatch(FetchSlipAsync({ id }));
    }
    return null;
  };
