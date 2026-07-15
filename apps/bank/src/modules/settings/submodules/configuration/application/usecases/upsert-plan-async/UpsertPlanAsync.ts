import { getErrorState, invalidateTags } from '@miya/kernel';
import { authSelectors } from '@/modules/auth';
import { createBankAsyncThunk } from '@/config/stores/thunks/CreateBankAsyncThunks';
import { pushToast } from '@/shared/toasts';
import { SettingsActions } from '../../../domain/slices/SettingsSlice';
import { UpsertPlanCommand } from './UpsertPlanCommand';
import { UpsertPlanResponse } from './UpsertPlanResponse';

/** Création ou modification d'un plan de cotisation : gateway → transition → cache → toast. */
export const UpsertPlanAsync = createBankAsyncThunk<UpsertPlanResponse, UpsertPlanCommand>(
  'settings/upsertPlan',
  async (command, { extra, dispatch, getState, rejectWithValue }) => {
    try {
      if (command.floorAmount <= 0) {
        throw new Error('Le montant doit être positif.');
      }

      const result = await extra.settingsGateway.upsertPlan(command);

      dispatch(SettingsActions.planUpserted({ by: authSelectors.selectCurrentUserDisplayName(getState()), at: new Date().toISOString(), plan: result.plan }));
      dispatch(invalidateTags(['Settings']));
      dispatch(
        pushToast({
          variant: 'success',
          title: command.id ? 'Plan modifié' : 'Plan ajouté',
          message: `${result.plan.floorAmount.toLocaleString('fr-FR')} FCFA / ${result.plan.frequencyLabel}`,
        }),
      );

      return result;
    } catch (error) {
      return rejectWithValue(getErrorState(error));
    }
  },
);
