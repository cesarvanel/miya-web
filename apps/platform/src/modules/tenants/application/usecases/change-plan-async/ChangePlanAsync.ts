import { getErrorState, invalidateTags } from '@miya/kernel';
import { authSelectors } from '@/modules/auth';
import { createPlatformAsyncThunk } from '@/config/thunks/CreatePlatformAsyncThunks';
import { pushToast } from '@/shared/toasts';
import { tenantPlanChanged } from '../../../domain/events';
import { selectTenantById } from '../../../domain/selectors/Selectors';
import { TenantsActions } from '../../../domain/slices/TenantsSlice';
import { ChangePlanCommand } from './ChangePlanCommand';

export const ChangePlanAsync = createPlatformAsyncThunk<void, ChangePlanCommand>(
  'tenants/changePlan',
  async ({ tenantId, planId }, { extra, dispatch, getState, rejectWithValue }) => {
    try {
      const fromPlanName = selectTenantById(getState(), tenantId)?.plan.name ?? '';
      const tenant = await extra.tenantGateway.changePlan(tenantId, planId);
      const at = new Date().toISOString();
      const by = authSelectors.selectCurrentUserDisplayName(getState());
      const byId = authSelectors.selectCurrentUser(getState())?.id ?? '';

      dispatch(TenantsActions.planChanged({ tenantId, at, plan: tenant.plan, usage: tenant.usage }));
      dispatch(
        tenantPlanChanged({
          tenantId,
          tenantName: tenant.name,
          fromPlanName,
          toPlanName: tenant.plan.name,
          by,
          byId,
          at,
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
