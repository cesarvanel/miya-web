import { getErrorState } from '@miya/kernel';
import { createBankCachedAsyncThunk } from '@/config/stores/thunks/CreateBankAsyncThunks';
import { FetchSettingsCommand } from './FetchSettingsCommand';
import { FetchSettingsResponse } from './FetchSettingsResponse';

/** Alimente l'espace Configuration — ttl 60s. */
export const FetchSettingsAsync = createBankCachedAsyncThunk<FetchSettingsResponse, FetchSettingsCommand>(
  'settings/fetchSettings',
  async (_arg, { extra, rejectWithValue }) => {
    try {
      return await extra.settingsGateway.fetch();
    } catch (error) {
      return rejectWithValue(getErrorState(error));
    }
  },
  { key: 'settings:all', tags: ['Settings'], ttlMs: 60_000 },
);
