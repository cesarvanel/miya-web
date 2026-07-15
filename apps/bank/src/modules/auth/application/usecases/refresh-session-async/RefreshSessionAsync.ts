import { getErrorState } from '@miya/kernel';
import { createBankAsyncThunk } from '@/config/stores/thunks/CreateBankAsyncThunks';
import { selectCurrentUser } from '../../../domain/selectors/Selectors';
import { RefreshSessionCommand } from './RefreshSessionCommand';
import { RefreshSessionResponse } from './RefreshSessionResponse';

/** « Reprendre ma session » — prolonge sans perdre la page courante. */
export const RefreshSessionAsync = createBankAsyncThunk<RefreshSessionResponse, RefreshSessionCommand>(
  'auth/refreshSession',
  async ({ password }, { extra, getState, rejectWithValue }) => {
    try {
      const identifier = selectCurrentUser(getState())?.email ?? '';
      return await extra.authGateway.refreshSession(identifier, password);
    } catch (error) {
      return rejectWithValue(getErrorState(error));
    }
  },
);
