import { getErrorState } from '@miya/kernel';
import { createBankCachedAsyncThunk } from '@/config/stores/thunks/CreateBankAsyncThunks';
import { FetchDaySummaryCommand } from './FetchDaySummaryCommand';
import { FetchDaySummaryResponse } from './FetchDaySummaryResponse';

/** Écran temps réel : ttl court (30s) — un refresh manuel/périodique reste toujours pertinent. */
export const FetchDaySummaryAsync = createBankCachedAsyncThunk<
  FetchDaySummaryResponse,
  FetchDaySummaryCommand
>(
  'dashboard/fetchDaySummary',
  async (_arg, { extra, rejectWithValue }) => {
    try {
      return await extra.dashboardGateway.fetchDaySummary();
    } catch (error) {
      return rejectWithValue(getErrorState(error));
    }
  },
  { key: 'dashboard:daySummary', tags: ['DaySummary'], ttlMs: 30_000 },
);
