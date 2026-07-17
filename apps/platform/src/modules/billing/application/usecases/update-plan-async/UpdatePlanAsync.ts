import { getErrorState, invalidateTags } from '@miya/kernel';
import { createPlatformAsyncThunk } from '@/config/thunks/CreatePlatformAsyncThunks';
import { pushToast } from '@/shared/toasts';
import { BillingActions } from '../../../domain/slices/BillingSlice';
import { UpdatePlanCommand } from './UpdatePlanCommand';

/** Le nouveau tarif/limites s'appliquent au prochain cycle de facturation pour les banques déjà abonnées. */
export const UpdatePlanAsync = createPlatformAsyncThunk<void, UpdatePlanCommand>(
  'billing/updatePlan',
  async (command, { extra, dispatch, rejectWithValue }) => {
    try {
      const plan = await extra.billingGateway.updatePlan(command);

      dispatch(BillingActions.updatePlan({ planId: plan.id, monthlyPrice: plan.monthlyPrice, limits: plan.limits }));
      dispatch(invalidateTags(['Billing']));
      dispatch(
        pushToast({
          variant: 'success',
          title: 'Plan mis à jour',
          message: 'Applicable au prochain cycle de facturation.',
        }),
      );
    } catch (error) {
      return rejectWithValue(getErrorState(error));
    }
  },
);
