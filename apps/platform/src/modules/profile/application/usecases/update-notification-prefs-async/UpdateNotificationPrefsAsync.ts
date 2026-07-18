import { getErrorState } from '@miya/kernel';
import { createPlatformAsyncThunk } from '@/config/thunks/CreatePlatformAsyncThunks';
import type { PlatformNotificationPreferences } from '../../../domain/entities/Profile';

export const UpdateNotificationPrefsAsync = createPlatformAsyncThunk<PlatformNotificationPreferences, PlatformNotificationPreferences>(
  'profile/updateNotificationPrefs',
  async (command, { extra, rejectWithValue }) => {
    try {
      await extra.platformProfileGateway.updateNotificationPrefs(command);
      return command;
    } catch (error) {
      return rejectWithValue(getErrorState(error));
    }
  },
);
