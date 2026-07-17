import { getErrorState, invalidateTags } from '@miya/kernel';
import { authSelectors } from '@/modules/auth';
import { createPlatformAsyncThunk } from '@/config/thunks/CreatePlatformAsyncThunks';
import { pushToast } from '@/shared/toasts';
import { planUpdated } from '../../../domain/events';
import { selectPlanById } from '../../../domain/selectors/Selectors';
import { BillingActions } from '../../../domain/slices/BillingSlice';
import { UpdatePlanCommand } from './UpdatePlanCommand';

/** Le nouveau tarif/limites s'appliquent au prochain cycle de facturation pour les banques déjà abonnées. */
export const UpdatePlanAsync = createPlatformAsyncThunk<void, UpdatePlanCommand>(
  'billing/updatePlan',
  async (command, { extra, dispatch, getState, rejectWithValue }) => {
    try {
      const previousMonthlyPrice = selectPlanById(getState(), command.planId)?.monthlyPrice ?? command.monthlyPrice;
      const plan = await extra.billingGateway.updatePlan(command);
      const at = new Date().toISOString();
      const by = authSelectors.selectCurrentUserDisplayName(getState());
      const byId = authSelectors.selectCurrentUser(getState())?.id ?? '';

      dispatch(BillingActions.updatePlan({ planId: plan.id, monthlyPrice: plan.monthlyPrice, limits: plan.limits }));
      dispatch(
        planUpdated({
          planId: plan.id,
          planName: plan.name,
          previousMonthlyPrice,
          monthlyPrice: plan.monthlyPrice,
          by,
          byId,
          at,
        }),
      );
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
