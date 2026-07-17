import { getErrorState } from '@miya/kernel';
import { createPlatformCachedAsyncThunk } from '@/config/thunks/CreatePlatformAsyncThunks';
import type { OverviewSnapshot } from '../../ports/OverviewGateway';

/** Écran temps réel : ttl court (60s) — un refresh manuel/périodique reste toujours pertinent. */
export const FetchOverviewAsync = createPlatformCachedAsyncThunk<OverviewSnapshot, void>(
  'overview/fetchOverview',
  async (_arg, { extra, rejectWithValue }) => {
    try {
      return await extra.overviewGateway.fetchOverview();
    } catch (error) {
      return rejectWithValue(getErrorState(error));
    }
  },
  { key: 'overview:snapshot', tags: ['Overview'], ttlMs: 60_000 },
);
