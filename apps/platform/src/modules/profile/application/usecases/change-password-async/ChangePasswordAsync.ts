import { checkPasswordStrength, getErrorState } from '@miya/kernel';
import { createPlatformAsyncThunk } from '@/config/thunks/CreatePlatformAsyncThunks';
import { pushToast } from '@/shared/toasts';
import { ChangePasswordCommand } from './ChangePasswordCommand';

/** Mêmes règles de robustesse mutualisées (kernel) que la réinitialisation du mot de passe. */
export const ChangePasswordAsync = createPlatformAsyncThunk<void, ChangePasswordCommand>(
  'profile/changePassword',
  async ({ currentPassword, newPassword }, { extra, dispatch, rejectWithValue }) => {
    try {
      if (!checkPasswordStrength(newPassword).isValid) {
        throw new Error('Le nouveau mot de passe ne respecte pas les règles de robustesse.');
      }
      await extra.platformProfileGateway.changePassword(currentPassword, newPassword);
      dispatch(pushToast({ variant: 'success', title: 'Mot de passe modifié', message: 'Votre mot de passe a été mis à jour.' }));
    } catch (error) {
      return rejectWithValue(getErrorState(error));
    }
  },
);
