import { getErrorState, invalidateTags } from '@miya/kernel';
import { AuthActions } from '@/modules/auth';
import { createBankAsyncThunk } from '@/config/stores/thunks/CreateBankAsyncThunks';
import { pushToast } from '@/shared/toasts';
import { UpdatePersonalInfoCommand } from './UpdatePersonalInfoCommand';

/** Le nom/téléphone/email affichés partout (sidebar, attributions…) viennent de la session — on la resynchronise ici. */
export const UpdatePersonalInfoAsync = createBankAsyncThunk<void, UpdatePersonalInfoCommand>(
  'profile/updatePersonalInfo',
  async (command, { extra, dispatch, rejectWithValue }) => {
    try {
      await extra.profileGateway.updatePersonalInfo(command);

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
