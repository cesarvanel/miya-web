import { getErrorState } from '@miya/kernel';
import { authSelectors } from '@/modules/auth';
import { createPlatformCachedAsyncThunk } from '@/config/thunks/CreatePlatformAsyncThunks';
import type { ProfileSnapshot } from '../../ports/PlatformProfileGateway';

/** Alimente la page Mon profil — ttl 60s. */
export const FetchProfileAsync = createPlatformCachedAsyncThunk<ProfileSnapshot, void>(
  'profile/fetchProfile',
  async (_arg, { extra, getState, rejectWithValue }) => {
    try {
      const userId = authSelectors.selectCurrentUser(getState())?.id ?? '';
      return await extra.platformProfileGateway.fetchProfile(userId);
    } catch (error) {
      return rejectWithValue(getErrorState(error));
    }
  },
  { key: 'profile:mine', tags: ['Profile'], ttlMs: 60_000 },
);
