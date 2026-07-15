import { getErrorState, invalidateTags } from '@miya/kernel';
import { authSelectors } from '@/modules/auth';
import { createBankAsyncThunk } from '@/config/stores/thunks/CreateBankAsyncThunks';
import { closeModal } from '@/shared/modals';
import { pushToast } from '@/shared/toasts';
import { SettingsActions } from '../../../domain/slices/SettingsSlice';
import { UpdateIdentityCommand } from './UpdateIdentityCommand';
import { UpdateIdentityResponse } from './UpdateIdentityResponse';

/** Identité de l'institution : gateway → transition (le domaine construit le journal) → cache → toast. */
export const UpdateIdentityAsync = createBankAsyncThunk<UpdateIdentityResponse, UpdateIdentityCommand>(
  'settings/updateIdentity',
  async (changes, { extra, dispatch, getState, rejectWithValue }) => {
    try {
      await extra.settingsGateway.updateIdentity(changes);

      dispatch(SettingsActions.identityUpdated({ by: authSelectors.selectCurrentUserDisplayName(getState()), at: new Date().toISOString(), changes }));
      dispatch(invalidateTags(['Settings']));
      dispatch(closeModal());
      dispatch(
        pushToast({
          variant: 'success',
          title: 'Identité mise à jour',
          message: 'Les nouveaux documents utiliseront ce logo et cette couleur.',
        }),
      );
    } catch (error) {
      return rejectWithValue(getErrorState(error));
    }
  },
);
