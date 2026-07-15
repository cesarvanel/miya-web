import { getErrorState } from '@miya/kernel';
import { createBankAsyncThunk } from '@/config/stores/thunks/CreateBankAsyncThunks';
import { LoginCommand } from './LoginCommand';
import { LoginResponse } from './LoginResponse';

/**
 * Ne rejette QUE sur une erreur technique inattendue — un échec métier
 * (identifiants invalides, sélection de banque requise) est un `outcome`
 * du payload résolu, géré par le slice, pas une exception.
 */
export const LoginAsync = createBankAsyncThunk<LoginResponse, LoginCommand>(
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
