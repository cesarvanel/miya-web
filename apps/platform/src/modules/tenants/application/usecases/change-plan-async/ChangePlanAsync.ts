import { getErrorState, invalidateTags } from '@miya/kernel';
import { createPlatformAsyncThunk } from '@/config/thunks/CreatePlatformAsyncThunks';
import { pushToast } from '@/shared/toasts';
import { TenantsActions } from '../../../domain/slices/TenantsSlice';
import { ChangePlanCommand } from './ChangePlanCommand';

export const ChangePlanAsync = createPlatformAsyncThunk<void, ChangePlanCommand>(
  'tenants/changePlan',
  async ({ tenantId, planId }, { extra, dispatch, rejectWithValue }) => {
    try {
      const tenant = await extra.tenantGateway.changePlan(tenantId, planId);

      dispatch(
        TenantsActions.planChanged({
          tenantId,
          at: new Date().toISOString(),
          plan: tenant.plan,
          usage: tenant.usage,
        }),
      );
      dispatch(invalidateTags(['Tenants', 'Billing']));
      dispatch(
        pushToast({
          variant: 'success',
          title: 'Plan mis à jour',
          message: 'Nouveau plan effectif au prochain cycle de facturation.',
        }),
      );
    } catch (error) {
      return rejectWithValue(getErrorState(error));
    }
  },
);
