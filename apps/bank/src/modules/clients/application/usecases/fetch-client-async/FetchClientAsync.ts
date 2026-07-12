import { getErrorState } from '@miya/kernel';
import { createBankCachedAsyncThunk } from '@/config/stores/thunks/CreateBankAsyncThunks';
import { FetchClientCommand } from './FetchClientCommand';
import { FetchClientResponse } from './FetchClientResponse';

/** Alimente la fiche client — ttl 60s. */
export const FetchClientAsync = createBankCachedAsyncThunk<
  FetchClientResponse,
  FetchClientCommand
>(
  'clients/fetchClient',
  async ({ id }, { extra, rejectWithValue }) => {
    try {
      return await extra.clientGateway.fetchOne(id);
    } catch (error) {
      return rejectWithValue(getErrorState(error));
    }
  },
  { key: (arg) => `clients:one:${arg.id}`, tags: (arg) => ['Client', `Client:${arg.id}`], ttlMs: 60_000 },
);
