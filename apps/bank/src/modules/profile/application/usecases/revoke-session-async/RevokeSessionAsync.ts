import { getErrorState } from '@miya/kernel';
import { createBankAsyncThunk } from '@/config/stores/thunks/CreateBankAsyncThunks';
import { pushToast } from '@/shared/toasts';
import { RevokeSessionCommand } from './RevokeSessionCommand';

export const RevokeSessionAsync = createBankAsyncThunk<{ sessionId: string }, RevokeSessionCommand>(
  'profile/revokeSession',
  async ({ sessionId }, { extra, dispatch, rejectWithValue }) => {
    try {
      await extra.profileGateway.revokeSession(sessionId);
      dispatch(pushToast({ variant: 'success', title: 'Session déconnectée', message: 'Cet appareil devra se reconnecter.' }));
      return { sessionId };
    } catch (error) {
      return rejectWithValue(getErrorState(error));
    }
  },
);
