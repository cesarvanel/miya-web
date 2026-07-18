import { getErrorState, invalidateTags } from '@miya/kernel';
import { AuthActions } from '@/modules/auth';
import { createPlatformAsyncThunk } from '@/config/thunks/CreatePlatformAsyncThunks';
import { pushToast } from '@/shared/toasts';
import { UpdatePersonalInfoCommand } from './UpdatePersonalInfoCommand';

/** Le nom affiché partout (sidebar, journal d'audit…) vient de la session — on la resynchronise ici. */
export const UpdatePersonalInfoAsync = createPlatformAsyncThunk<void, UpdatePersonalInfoCommand>(
  'profile/updatePersonalInfo',
  async (command, { extra, dispatch, rejectWithValue }) => {
    try {
      await extra.platformProfileGateway.updatePersonalInfo(command);

      dispatch(
        AuthActions.sessionUserUpdated({
          fullName: `${command.firstName} ${command.lastName}`.trim(),
          phone: command.phone,
          email: command.email,
        }),
      );
      dispatch(invalidateTags(['Profile']));
      dispatch(pushToast({ variant: 'success', title: 'Informations mises à jour', message: 'Vos informations personnelles ont été enregistrées.' }));
    } catch (error) {
      return rejectWithValue(getErrorState(error));
    }
  },
);
