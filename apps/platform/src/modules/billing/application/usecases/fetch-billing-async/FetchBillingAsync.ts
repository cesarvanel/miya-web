import { getErrorState } from '@miya/kernel';
import { createPlatformCachedAsyncThunk } from '@/config/thunks/CreatePlatformAsyncThunks';
import type { FetchBillingResponse } from './FetchBillingResponse';

export const FetchBillingAsync = createPlatformCachedAsyncThunk<FetchBillingResponse, void>(
  'billing/fetchBilling',
  async (_arg, { extra, rejectWithValue }) => {
    try {
      const [plans, invoices] = await Promise.all([
        extra.billingGateway.fetchPlans(),
        extra.billingGateway.fetchInvoices(),
      ]);
      return { plans, invoices };
    } catch (error) {
      return rejectWithValue(getErrorState(error));
    }
  },
  { key: 'billing:all', tags: ['Billing'], ttlMs: 60_000 },
);
