import { getErrorState, invalidateTags } from '@miya/kernel';
import { authSelectors } from '@/modules/auth';
import { createPlatformAsyncThunk } from '@/config/thunks/CreatePlatformAsyncThunks';
import { pushToast } from '@/shared/toasts';
import { tenantCreated } from '../../../domain/events';
import { TenantsActions } from '../../../domain/slices/TenantsSlice';
import type { Tenant } from '../../../domain/entities/Tenant';
import type { CreateTenantCommand } from '../../ports/TenantGateway';

/** Provisionne un nouveau tenant et envoie l'invitation à son admin. La navigation vers la fiche se fait côté vue. */
export const CreateTenantAsync = createPlatformAsyncThunk<Tenant, CreateTenantCommand>(
  'tenants/createTenant',
  async (command, { extra, dispatch, getState, rejectWithValue }) => {
    try {
      const tenant = await extra.tenantGateway.create(command);
      const at = new Date().toISOString();
      const by = authSelectors.selectCurrentUserDisplayName(getState());
      const byId = authSelectors.selectCurrentUser(getState())?.id ?? '';

      dispatch(TenantsActions.created({ tenant }));
      dispatch(tenantCreated({ tenantId: tenant.id, tenantName: tenant.name, by, byId, at }));
      dispatch(invalidateTags(['Tenants']));
      dispatch(
        pushToast({
          variant: 'success',
          title: 'Banque créée — invitation envoyée à l’admin',
          message: `${tenant.name} recevra un e-mail d'activation.`,
        }),
      );

      return tenant;
    } catch (error) {
      return rejectWithValue(getErrorState(error));
    }
  },
);
