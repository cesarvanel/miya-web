import { getErrorState, invalidateTags } from '@miya/kernel';
import { createBankAsyncThunk } from '@/config/stores/thunks/CreateBankAsyncThunks';
import { pushToast } from '@/shared/toasts';
import { SettingsActions } from '../../../domain/slices/SettingsSlice';
import { UpdateSettlementDeadlineCommand } from './UpdateSettlementDeadlineCommand';

/** Fenêtre de reversement (maquette 9e) : gateway → transition → cache → toast. */
export const UpdateSettlementDeadlineAsync = createBankAsyncThunk<void, UpdateSettlementDeadlineCommand>(
  'settings/updateSettlementDeadline',
  async (changes, { extra, dispatch, rejectWithValue }) => {
    try {
      await extra.settingsGateway.updateCollectionRules(changes);

      dispatch(SettingsActions.collectionRulesUpdated({ by: 'D. Ndione', at: new Date().toISOString(), changes }));
      dispatch(invalidateTags(['Settings']));
      dispatch(
        pushToast({
          variant: 'success',
          title: 'Fenêtre de reversement mise à jour',
          message: "S'applique dès la prochaine journée de collecte.",
        }),
      );
    } catch (error) {
      return rejectWithValue(getErrorState(error));
    }
  },
);
