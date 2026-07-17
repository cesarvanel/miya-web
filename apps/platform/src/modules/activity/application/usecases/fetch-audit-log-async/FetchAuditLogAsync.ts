import { getErrorState } from '@miya/kernel';
import { createPlatformCachedAsyncThunk } from '@/config/thunks/CreatePlatformAsyncThunks';
import type { AuditEntry } from '../../../domain/entities/AuditEntry';

/**
 * Charge l'intégralité de la piste d'audit une seule fois (clé de cache
 * unique) — tout le filtrage (banque, type d'action, période) se fait ensuite
 * côté selector, jamais en refetchant avec des filtres différents : les
 * entrées ajoutées en direct par les events (`tenantSuspended`, `invoicePaid`…)
 * ne doivent jamais être écrasées par un fetch partiel.
 */
export const FetchAuditLogAsync = createPlatformCachedAsyncThunk<AuditEntry[], void>(
  'activity/fetchAuditLog',
  async (_arg, { extra, rejectWithValue }) => {
    try {
      return await extra.activityGateway.fetchAuditLog({});
    } catch (error) {
      return rejectWithValue(getErrorState(error));
    }
  },
  { key: 'activity:auditLog', tags: ['AuditLog'], ttlMs: 30_000 },
);
