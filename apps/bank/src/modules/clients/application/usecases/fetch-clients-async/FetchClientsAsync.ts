import { getErrorState } from '@miya/kernel';
import { createBankCachedAsyncThunk } from '@/config/stores/thunks/CreateBankAsyncThunks';
import { FetchClientsCommand } from './FetchClientsCommand';
import { FetchClientsResponse } from './FetchClientsResponse';

/** Alimente le listing des clients — ttl 60s (moins volatile que les tournées/disputes). */
export const FetchClientsAsync = createBankCachedAsyncThunk<
  FetchClientsResponse,
  FetchClientsCommand
>(
  'clients/fetchClients',
  async (_arg, { extra, rejectWithValue }) => {
    try {
      return await extra.clientGateway.fetchAll();
    } catch (error) {
      return rejectWithValue(getErrorState(error));
    }
  },
  { key: 'clients:all', tags: ['Clients'], ttlMs: 60_000 },
);
