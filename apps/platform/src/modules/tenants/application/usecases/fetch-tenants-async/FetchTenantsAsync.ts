import { getErrorState } from '@miya/kernel';
import { createPlatformCachedAsyncThunk } from '@/config/thunks/CreatePlatformAsyncThunks';
import type { Tenant } from '../../../domain/entities/Tenant';

export const FetchTenantsAsync = createPlatformCachedAsyncThunk<Tenant[], void>(
  'tenants/fetchTenants',
  async (_arg, { extra, rejectWithValue }) => {
    try {
      return await extra.tenantGateway.fetchAll();
    } catch (error) {
      return rejectWithValue(getErrorState(error));
    }
  },
  { key: 'tenants:all', tags: ['Tenants'], ttlMs: 60_000 },
);
