import { getErrorState } from '@miya/kernel';
import { authSelectors } from '@/modules/auth';
import { createBankCachedAsyncThunk } from '@/config/stores/thunks/CreateBankAsyncThunks';
import { FetchProfileCommand } from './FetchProfileCommand';
import { FetchProfileResponse } from './FetchProfileResponse';

/** Alimente la page Mon profil — ttl 60s. */
export const FetchProfileAsync = createBankCachedAsyncThunk<FetchProfileResponse, FetchProfileCommand>(
  'profile/fetchProfile',
  async (_arg, { extra, getState, rejectWithValue }) => {
    try {
      const userId = authSelectors.selectCurrentUser(getState())?.id ?? '';
      return await extra.profileGateway.fetchProfile(userId);
    } catch (error) {
      return rejectWithValue(getErrorState(error));
    }
  },
  { key: 'profile:mine', tags: ['Profile'], ttlMs: 60_000 },
);
