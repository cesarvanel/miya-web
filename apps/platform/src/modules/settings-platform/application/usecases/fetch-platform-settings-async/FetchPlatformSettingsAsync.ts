import { getErrorState } from '@miya/kernel';
import { createPlatformCachedAsyncThunk } from '@/config/thunks/CreatePlatformAsyncThunks';
import type { FetchAllResponse } from '../../ports/PlatformSettingsGateway';

/** Identité, collaborateurs, modèles ET journal des changements — un seul appel. */
export const FetchPlatformSettingsAsync = createPlatformCachedAsyncThunk<FetchAllResponse, void>(
  'platformSettings/fetchAll',
  async (_arg, { extra, rejectWithValue }) => {
    try {
      return await extra.platformSettingsGateway.fetchAll();
    } catch (error) {
      return rejectWithValue(getErrorState(error));
    }
  },
  { key: 'platformSettings:all', tags: ['PlatformSettings'], ttlMs: 60_000 },
);
