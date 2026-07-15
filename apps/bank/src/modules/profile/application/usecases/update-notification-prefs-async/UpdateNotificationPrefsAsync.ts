import { getErrorState } from '@miya/kernel';
import { createBankAsyncThunk } from '@/config/stores/thunks/CreateBankAsyncThunks';
import type { NotificationPreferences } from '../../../domain/entities/Profile';
import { UpdateNotificationPrefsCommand } from './UpdateNotificationPrefsCommand';

export const UpdateNotificationPrefsAsync = createBankAsyncThunk<NotificationPreferences, UpdateNotificationPrefsCommand>(
  'profile/updateNotificationPrefs',
  async (command, { extra, rejectWithValue }) => {
    try {
      await extra.profileGateway.updateNotificationPrefs(command);
      return command;
    } catch (error) {
      return rejectWithValue(getErrorState(error));
    }
  },
);
