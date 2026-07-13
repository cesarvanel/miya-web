import type { LoaderFunction } from 'react-router-dom';
import type { BankStore } from '@/config/stores/store';
import { FetchAgentAsync } from '../../../application/usecases/fetch-agent-async/FetchAgentAsync';
import { FetchAgentDayRecordsAsync } from '../../../application/usecases/fetch-agent-day-records-async/FetchAgentDayRecordsAsync';
import { FetchAgentsAsync } from '../../../application/usecases/fetch-agents-async/FetchAgentsAsync';

/** Déclenche le chargement (caché) du listing des agents & responsables. */
export const GetAgentsLoader =
  (store: BankStore): LoaderFunction =>
  () => {
    store.dispatch(FetchAgentsAsync({}));
    return null;
  };

/** Déclenche le chargement (caché) de la fiche agent et de ses journées. */
export const GetAgentDetailLoader =
  (store: BankStore): LoaderFunction =>
  ({ params }) => {
    const id = params.id;
    if (id) {
      store.dispatch(FetchAgentAsync({ id }));
      store.dispatch(FetchAgentDayRecordsAsync({ agentId: id }));
    }
    return null;
  };
