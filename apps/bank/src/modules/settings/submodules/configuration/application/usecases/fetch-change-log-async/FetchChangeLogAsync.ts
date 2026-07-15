import { getErrorState } from '@miya/kernel';
import { createBankCachedAsyncThunk } from '@/config/stores/thunks/CreateBankAsyncThunks';
import { FetchChangeLogCommand } from './FetchChangeLogCommand';
import { FetchChangeLogResponse } from './FetchChangeLogResponse';

/** Alimente le Journal des changements — ttl 60s. Le journal seed (fixe) fusionne avec les entrées locales déjà poussées par le domaine. */
export const FetchChangeLogAsync = createBankCachedAsyncThunk<FetchChangeLogResponse, FetchChangeLogCommand>(
  'settings/fetchChangeLog',
  async (_arg, { extra, rejectWithValue }) => {
    try {
      return await extra.settingsGateway.fetchChangeLog();
    } catch (error) {
      return rejectWithValue(getErrorState(error));
    }
  },
  { key: 'settings:changeLog', tags: ['ChangeLog'], ttlMs: 60_000 },
);
