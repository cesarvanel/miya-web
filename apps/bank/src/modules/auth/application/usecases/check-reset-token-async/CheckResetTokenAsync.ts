import { getErrorState } from '@miya/kernel';
import { createBankAsyncThunk } from '@/config/stores/thunks/CreateBankAsyncThunks';
import { CheckResetTokenCommand } from './CheckResetTokenCommand';
import { CheckResetTokenResponse } from './CheckResetTokenResponse';

/** Consommée par ResetPasswordPage pour décider d'afficher le formulaire ou ExpiredLinkPage. */
export const CheckResetTokenAsync = createBankAsyncThunk<CheckResetTokenResponse, CheckResetTokenCommand>(
  'auth/checkResetToken',
  async ({ token }, { extra, rejectWithValue }) => {
    try {
      const check = await extra.authGateway.checkResetToken(token);
      return { check };
    } catch (error) {
      return rejectWithValue(getErrorState(error));
    }
  },
);
