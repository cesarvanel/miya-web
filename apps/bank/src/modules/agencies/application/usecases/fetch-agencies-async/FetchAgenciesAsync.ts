import { getErrorState } from '@miya/kernel';
import { createBankCachedAsyncThunk } from '@/config/stores/thunks/CreateBankAsyncThunks';
import { FetchAgenciesCommand } from './FetchAgenciesCommand';
import { FetchAgenciesResponse } from './FetchAgenciesResponse';

/** Alimente l'espace Zones & agences — ttl 60s. */
export const FetchAgenciesAsync = createBankCachedAsyncThunk<FetchAgenciesResponse, FetchAgenciesCommand>(
  'agencies/fetchAgencies',
  async (_arg, { extra, rejectWithValue }) => {
    try {
      return await extra.agenciesGateway.fetch();
    } catch (error) {
      return rejectWithValue(getErrorState(error));
    }
  },
  { key: 'agencies:all', tags: ['Agencies'], ttlMs: 60_000 },
);
