import { getErrorState } from '@miya/kernel';
import { createBankCachedAsyncThunk } from '@/config/stores/thunks/CreateBankAsyncThunks';
import { FetchRoundDetailCommand } from './FetchRoundDetailCommand';
import { FetchRoundDetailResponse } from './FetchRoundDetailResponse';

/** Alimente le drill-down d'une tournée — ttl court, suivi temps réel. */
export const FetchRoundDetailAsync = createBankCachedAsyncThunk<
  FetchRoundDetailResponse,
  FetchRoundDetailCommand
>(
  'collections/fetchRoundDetail',
  async ({ roundId }, { extra, rejectWithValue }) => {
    try {
      return await extra.collectionGateway.fetchRoundDetail(roundId);
    } catch (error) {
      return rejectWithValue(getErrorState(error));
    }
  },
  { key: (arg) => `collections:round:${arg.roundId}`, tags: (arg) => ['Round', `Round:${arg.roundId}`], ttlMs: 30_000 },
);
