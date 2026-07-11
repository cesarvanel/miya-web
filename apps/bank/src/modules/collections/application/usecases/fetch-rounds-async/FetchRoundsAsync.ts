import { getErrorState } from '@miya/kernel';
import { createBankCachedAsyncThunk } from '@/config/stores/thunks/CreateBankAsyncThunks';
import { FetchRoundsCommand } from './FetchRoundsCommand';
import { FetchRoundsResponse } from './FetchRoundsResponse';

/** Alimente le listing des tournées du jour — ttl court, suivi temps réel. */
export const FetchRoundsAsync = createBankCachedAsyncThunk<
  FetchRoundsResponse,
  FetchRoundsCommand
>(
  'collections/fetchRounds',
  async ({ date }, { extra, rejectWithValue }) => {
    try {
      return await extra.collectionGateway.fetchRounds(date);
    } catch (error) {
      return rejectWithValue(getErrorState(error));
    }
  },
  { key: (arg) => `collections:rounds:${arg.date}`, tags: ['Rounds'], ttlMs: 30_000 },
);
