import { getErrorState } from '@miya/kernel';
import { createBankCachedAsyncThunk } from '@/config/stores/thunks/CreateBankAsyncThunks';
import { FetchClientOperationsCommand } from './FetchClientOperationsCommand';
import { FetchClientOperationsResponse } from './FetchClientOperationsResponse';

/** Alimente l'historique des mouvements de la fiche client — ttl 60s. */
export const FetchClientOperationsAsync = createBankCachedAsyncThunk<
  FetchClientOperationsResponse,
  FetchClientOperationsCommand
>(
  'clients/fetchClientOperations',
  async ({ clientId }, { extra, rejectWithValue }) => {
    try {
      return await extra.clientGateway.fetchOperations(clientId);
    } catch (error) {
      return rejectWithValue(getErrorState(error));
    }
  },
  {
    key: (arg) => `clients:operations:${arg.clientId}`,
    tags: (arg) => ['ClientOperations', `ClientOperations:${arg.clientId}`],
    ttlMs: 60_000,
  },
);
