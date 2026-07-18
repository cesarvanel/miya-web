import { getErrorState, invalidateTags } from '@miya/kernel';
import { authSelectors } from '@/modules/auth';
import { createPlatformAsyncThunk } from '@/config/thunks/CreatePlatformAsyncThunks';
import { pushToast } from '@/shared/toasts';
import { PlatformSettingsActions } from '../../../domain/slices/PlatformSettingsSlice';
import type { PlatformIdentity } from '../../../domain/entities/PlatformIdentity';

/** Identité de l'éditeur : ces informations apparaissent sur les factures d'abonnement envoyées aux banques. */
export const UpdateIdentityAsync = createPlatformAsyncThunk<void, Partial<PlatformIdentity>>(
  'platformSettings/updateIdentity',
  async (changes, { extra, dispatch, getState, rejectWithValue }) => {
    try {
      await extra.platformSettingsGateway.updateIdentity(changes);

      dispatch(PlatformSettingsActions.identityUpdated({ by: authSelectors.selectCurrentUserDisplayName(getState()), at: new Date().toISOString(), changes }));
      dispatch(invalidateTags(['PlatformSettings']));
      dispatch(
        pushToast({
          variant: 'success',
          title: 'Identité mise à jour',
          message: 'Ces informations apparaissent sur les factures des banques.',
        }),
      );
    } catch (error) {
      return rejectWithValue(getErrorState(error));
    }
  },
);
