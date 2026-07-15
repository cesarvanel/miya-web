import { getErrorState } from '@miya/kernel';
import { createBankAsyncThunk } from '@/config/stores/thunks/CreateBankAsyncThunks';
import { RequestPasswordResetCommand } from './RequestPasswordResetCommand';
import { RequestPasswordResetResponse } from './RequestPasswordResetResponse';

export const RequestPasswordResetAsync = createBankAsyncThunk<RequestPasswordResetResponse, RequestPasswordResetCommand>(
  'auth/requestPasswordReset',
  async ({ identifier }, { extra, rejectWithValue }) => {
    try {
      return await extra.authGateway.requestPasswordReset(identifier);
    } catch (error) {
      return rejectWithValue(getErrorState(error));
    }
  },
);
