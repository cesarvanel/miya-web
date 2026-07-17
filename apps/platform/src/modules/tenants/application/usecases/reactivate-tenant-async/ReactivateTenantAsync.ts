import { getErrorState, invalidateTags } from '@miya/kernel';
import { authSelectors } from '@/modules/auth';
import { createPlatformAsyncThunk } from '@/config/thunks/CreatePlatformAsyncThunks';
import { pushToast } from '@/shared/toasts';
import { tenantReactivated } from '../../../domain/events';
import { selectTenantById } from '../../../domain/selectors/Selectors';
import { TenantsActions } from '../../../domain/slices/TenantsSlice';

export const ReactivateTenantAsync = createPlatformAsyncThunk<void, { tenantId: string }>(
  'tenants/reactivateTenant',
  async ({ tenantId }, { extra, dispatch, getState, rejectWithValue }) => {
    try {
      await extra.tenantGateway.reactivate(tenantId);

      const tenantName = selectTenantById(getState(), tenantId)?.name ?? tenantId;
      const by = authSelectors.selectCurrentUserDisplayName(getState());
      const byId = authSelectors.selectCurrentUser(getState())?.id ?? '';
      const at = new Date().toISOString();

      dispatch(TenantsActions.reactivated({ tenantId, by, at }));
      dispatch(tenantReactivated({ tenantId, tenantName, by, byId, at }));
      dispatch(invalidateTags(['Tenants']));
      dispatch(
        pushToast({
          variant: 'success',
          title: 'Banque réactivée',
          message: "L'accès est restauré à l'identique.",
        }),
      );
    } catch (error) {
      return rejectWithValue(getErrorState(error));
    }
  },
);
