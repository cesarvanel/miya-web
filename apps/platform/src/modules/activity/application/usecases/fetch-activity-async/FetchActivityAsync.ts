import { getErrorState } from '@miya/kernel';
import { createPlatformCachedAsyncThunk } from '@/config/thunks/CreatePlatformAsyncThunks';
import type { UsagePeriod } from '../../ports/ActivityGateway';
import type { FetchActivityResponse } from './FetchActivityResponse';

/** Usage/synchro/adoption — 3 agrégats chargés ensemble, la période ne rejoue que la courbe d'usage. */
export const FetchActivityAsync = createPlatformCachedAsyncThunk<FetchActivityResponse, UsagePeriod>(
  'activity/fetchActivity',
  async (period, { extra, rejectWithValue }) => {
    try {
      const [usage, syncHealth, adoption] = await Promise.all([
        extra.activityGateway.fetchUsage(period),
        extra.activityGateway.fetchSyncHealth(),
        extra.activityGateway.fetchAdoption(),
      ]);
      return { usage, syncHealth, adoption };
    } catch (error) {
      return rejectWithValue(getErrorState(error));
    }
  },
  { key: (period) => `activity:all:${period}`, tags: ['Activity'], ttlMs: 60_000 },
);
