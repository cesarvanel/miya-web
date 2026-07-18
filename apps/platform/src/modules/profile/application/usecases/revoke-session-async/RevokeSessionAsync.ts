import { getErrorState } from '@miya/kernel';
import { createPlatformAsyncThunk } from '@/config/thunks/CreatePlatformAsyncThunks';
import { pushToast } from '@/shared/toasts';

export const RevokeSessionAsync = createPlatformAsyncThunk<{ sessionId: string }, { sessionId: string }>(
  'profile/revokeSession',
  async ({ sessionId }, { extra, dispatch, rejectWithValue }) => {
    try {
      await extra.platformProfileGateway.revokeSession(sessionId);
      dispatch(pushToast({ variant: 'success', title: 'Session déconnectée', message: 'Cet appareil devra se reconnecter.' }));
      return { sessionId };
    } catch (error) {
      return rejectWithValue(getErrorState(error));
    }
  },
);
