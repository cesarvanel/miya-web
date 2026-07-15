import { getErrorState, invalidateTags } from '@miya/kernel';
import { authSelectors } from '@/modules/auth';
import { createBankAsyncThunk } from '@/config/stores/thunks/CreateBankAsyncThunks';
import { pushToast } from '@/shared/toasts';
import { SettingsActions } from '../../../domain/slices/SettingsSlice';
import { UpdateCollectionRulesCommand } from './UpdateCollectionRulesCommand';

/** Auto-validation, contestation, tolérance d'écart (maquette 9f, enregistrement groupé). */
export const UpdateCollectionRulesAsync = createBankAsyncThunk<void, UpdateCollectionRulesCommand>(
  'settings/updateCollectionRules',
  async (changes, { extra, dispatch, getState, rejectWithValue }) => {
    try {
      await extra.settingsGateway.updateCollectionRules(changes);

      dispatch(SettingsActions.collectionRulesUpdated({ by: authSelectors.selectCurrentUserDisplayName(getState()), at: new Date().toISOString(), changes }));
      dispatch(invalidateTags(['Settings']));
      dispatch(
        pushToast({
          variant: 'success',
          title: 'Règles mises à jour',
          message: 'Ces règles s’appliqueront aux prochaines collectes.',
        }),
      );
    } catch (error) {
      return rejectWithValue(getErrorState(error));
    }
  },
);
