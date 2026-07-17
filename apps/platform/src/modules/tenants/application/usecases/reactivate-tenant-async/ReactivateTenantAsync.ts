import { getErrorState, invalidateTags } from '@miya/kernel';
import { authSelectors } from '@/modules/auth';
import { createPlatformAsyncThunk } from '@/config/thunks/CreatePlatformAsyncThunks';
import { pushToast } from '@/shared/toasts';
import { TenantsActions } from '../../../domain/slices/TenantsSlice';

export const ReactivateTenantAsync = createPlatformAsyncThunk<void, { tenantId: string }>(
  'tenants/reactivateTenant',
  async ({ tenantId }, { extra, dispatch, getState, rejectWithValue }) => {
    try {
      await extra.tenantGateway.reactivate(tenantId);

      dispatch(
        TenantsActions.reactivated({
          tenantId,
          by: authSelectors.selectCurrentUserDisplayName(getState()),
          at: new Date().toISOString(),
        }),
      );
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
