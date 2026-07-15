import { getErrorState, invalidateTags } from '@miya/kernel';
import { createBankAsyncThunk } from '@/config/stores/thunks/CreateBankAsyncThunks';
import { pushToast } from '@/shared/toasts';
import { SettingsActions } from '../../../domain/slices/SettingsSlice';
import { DeactivatePlanCommand } from './DeactivatePlanCommand';

/** Un plan utilisé ne peut pas être supprimé, seulement désactivé pour les nouveaux clients. */
export const DeactivatePlanAsync = createBankAsyncThunk<void, DeactivatePlanCommand>(
  'settings/deactivatePlan',
  async ({ planId }, { extra, dispatch, rejectWithValue }) => {
    try {
      await extra.settingsGateway.deactivatePlan(planId);

      dispatch(SettingsActions.planDeactivated({ by: 'D. Ndione', at: new Date().toISOString(), planId }));
      dispatch(invalidateTags(['Settings']));
      dispatch(
        pushToast({
          variant: 'success',
          title: 'Plan désactivé pour les nouveaux clients',
          message: 'Il reste actif pour les clients qui l’utilisent déjà.',
        }),
      );
    } catch (error) {
      return rejectWithValue(getErrorState(error));
    }
  },
);
