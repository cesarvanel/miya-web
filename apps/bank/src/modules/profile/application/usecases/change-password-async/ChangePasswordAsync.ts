import { getErrorState } from '@miya/kernel';
import { checkPasswordStrength } from '@/modules/auth';
import { createBankAsyncThunk } from '@/config/stores/thunks/CreateBankAsyncThunks';
import { pushToast } from '@/shared/toasts';
import { ChangePasswordCommand } from './ChangePasswordCommand';

/** Mêmes règles de robustesse que la réinitialisation (module auth). */
export const ChangePasswordAsync = createBankAsyncThunk<void, ChangePasswordCommand>(
  'profile/changePassword',
  async ({ currentPassword, newPassword }, { extra, dispatch, rejectWithValue }) => {
    try {
      if (!checkPasswordStrength(newPassword).isValid) {
        throw new Error('Le nouveau mot de passe ne respecte pas les règles de robustesse.');
      }
      await extra.profileGateway.changePassword(currentPassword, newPassword);
      dispatch(pushToast({ variant: 'success', title: 'Mot de passe modifié', message: 'Votre mot de passe a été mis à jour.' }));
    } catch (error) {
      return rejectWithValue(getErrorState(error));
    }
  },
);
