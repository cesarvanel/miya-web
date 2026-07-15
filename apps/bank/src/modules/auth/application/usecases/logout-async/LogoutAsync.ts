import { getErrorState } from '@miya/kernel';
import { createBankAsyncThunk } from '@/config/stores/thunks/CreateBankAsyncThunks';

/**
 * Purge le store entier (voir `RootReducer` — reset sur ce type d'action) ;
 * la redirection vers /login est faite par l'appelant (vue), qui a accès au
 * router, une fois le thunk résolu.
 */
export const LogoutAsync = createBankAsyncThunk<void, void>(
  'auth/logout',
  async (_arg, { extra, rejectWithValue }) => {
    try {
      await extra.authGateway.logout();
    } catch (error) {
      return rejectWithValue(getErrorState(error));
    }
  },
);
