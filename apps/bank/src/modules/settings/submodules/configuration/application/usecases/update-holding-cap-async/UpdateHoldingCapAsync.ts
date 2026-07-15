import { getErrorState, invalidateTags } from '@miya/kernel';
import { createBankAsyncThunk } from '@/config/stores/thunks/CreateBankAsyncThunks';
import { pushToast } from '@/shared/toasts';
import { SettingsActions } from '../../../domain/slices/SettingsSlice';
import { UpdateHoldingCapCommand } from './UpdateHoldingCapCommand';

/**
 * Plafond de détention (maquette 9d) : gateway → transition → cache → toast.
 * S'applique aux prochaines journées de collecte — pas aux tournées déjà ouvertes.
 */
export const UpdateHoldingCapAsync = createBankAsyncThunk<void, UpdateHoldingCapCommand>(
  'settings/updateHoldingCap',
  async (changes, { extra, dispatch, rejectWithValue }) => {
    try {
      if (changes.holdingCap <= 0) {
        throw new Error('Le plafond doit être positif.');
      }

      await extra.settingsGateway.updateCollectionRules(changes);

      dispatch(SettingsActions.collectionRulesUpdated({ by: 'D. Ndione', at: new Date().toISOString(), changes }));
      dispatch(invalidateTags(['Settings']));
      dispatch(
        pushToast({
          variant: 'success',
          title: 'Plafond de détention mis à jour',
          message: "S'applique aux prochaines journées de collecte.",
        }),
      );
    } catch (error) {
      return rejectWithValue(getErrorState(error));
    }
  },
);
