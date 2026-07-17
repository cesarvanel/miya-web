import { getErrorState } from '@miya/kernel';
import { createPlatformAsyncThunk } from '@/config/thunks/CreatePlatformAsyncThunks';

/**
 * Purge le store entier (voir `root-reducer` — reset sur ce type d'action) ;
 * la redirection vers /auth/login est faite par l'appelant (vue), qui a
 * accès au router, une fois le thunk résolu.
 */
export const LogoutAsync = createPlatformAsyncThunk<void, void>(
  'auth/logout',
  async (_arg, { extra, rejectWithValue }) => {
    try {
      await extra.authGateway.logout();
    } catch (error) {
      return rejectWithValue(getErrorState(error));
    }
  },
);
