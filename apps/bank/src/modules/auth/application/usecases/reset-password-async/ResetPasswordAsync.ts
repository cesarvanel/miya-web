import { getErrorState } from '@miya/kernel';
import { createBankAsyncThunk } from '@/config/stores/thunks/CreateBankAsyncThunks';
import { checkPasswordStrength } from '../../../domain/services/PasswordStrength';
import { ResetPasswordCommand } from './ResetPasswordCommand';

export const ResetPasswordAsync = createBankAsyncThunk<void, ResetPasswordCommand>(
  'auth/resetPassword',
  async ({ token, newPassword }, { extra, rejectWithValue }) => {
    try {
      if (!checkPasswordStrength(newPassword).isValid) {
        throw new Error('Le mot de passe ne respecte pas les règles de robustesse.');
      }
      await extra.authGateway.resetPassword(token, newPassword);
    } catch (error) {
      return rejectWithValue(getErrorState(error));
    }
  },
);
