import { getErrorState } from '@miya/kernel';
import { createPlatformCachedAsyncThunk } from '@/config/thunks/CreatePlatformAsyncThunks';
import type { FetchTenantResponse } from './FetchTenantResponse';

/** Fiche banque — tenant et journal chargés ensemble pour l'écran de détail. */
export const FetchTenantAsync = createPlatformCachedAsyncThunk<FetchTenantResponse, string>(
  'tenants/fetchTenant',
  async (tenantId, { extra, rejectWithValue }) => {
    try {
      const [tenant, events] = await Promise.all([
        extra.tenantGateway.fetchOne(tenantId),
        extra.tenantGateway.fetchEvents(tenantId),
      ]);
      return { tenant, events };
    } catch (error) {
      return rejectWithValue(getErrorState(error));
    }
  },
  {
    key: (tenantId) => `tenant:${tenantId}`,
    tags: (tenantId) => ['Tenants', `Tenant:${tenantId}`],
    ttlMs: 30_000,
  },
);
