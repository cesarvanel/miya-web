import { getErrorState } from '@miya/kernel';
import { createPlatformAsyncThunk } from '@/config/thunks/CreatePlatformAsyncThunks';
import { LoginCommand } from './LoginCommand';
import { LoginResponse } from './LoginResponse';

/**
 * Ne rejette QUE sur une erreur technique inattendue — un échec métier
 * (identifiants invalides) est un `outcome` du payload résolu, géré par le
 * slice, pas une exception.
 */
export const LoginAsync = createPlatformAsyncThunk<LoginResponse, LoginCommand>(
  'auth/login',
  async (command, { extra, rejectWithValue }) => {
    try {
      const outcome = await extra.authGateway.login(command);
      return { outcome };
    } catch (error) {
      return rejectWithValue(getErrorState(error));
    }
  },
);
