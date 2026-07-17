import { getErrorState, invalidateTags } from '@miya/kernel';
import { authSelectors } from '@/modules/auth';
import { createPlatformAsyncThunk } from '@/config/thunks/CreatePlatformAsyncThunks';
import { pushToast } from '@/shared/toasts';
import { tenantSuspended } from '../../../domain/events';
import { selectTenantById } from '../../../domain/selectors/Selectors';
import { TenantsActions } from '../../../domain/slices/TenantsSlice';
import { SuspendTenantCommand } from './SuspendTenantCommand';

/** Coupe immédiatement l'accès du tenant ; les données sont préservées, la réactivation restaure tout à l'identique. */
export const SuspendTenantAsync = createPlatformAsyncThunk<void, SuspendTenantCommand>(
  'tenants/suspendTenant',
  async ({ tenantId, reason }, { extra, dispatch, getState, rejectWithValue }) => {
    try {
      await extra.tenantGateway.suspend(tenantId, reason);

      const tenantName = selectTenantById(getState(), tenantId)?.name ?? tenantId;
      const by = authSelectors.selectCurrentUserDisplayName(getState());
      const byId = authSelectors.selectCurrentUser(getState())?.id ?? '';
      const at = new Date().toISOString();

      dispatch(TenantsActions.suspended({ tenantId, by, at, reason }));
      dispatch(tenantSuspended({ tenantId, tenantName, reason, by, byId, at }));
      dispatch(invalidateTags(['Tenants']));
      dispatch(
        pushToast({
          variant: 'success',
          title: 'Banque suspendue',
          message: 'Accès coupé — toutes les données sont conservées.',
        }),
      );
    } catch (error) {
      return rejectWithValue(getErrorState(error));
    }
  },
);
