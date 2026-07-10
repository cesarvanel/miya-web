import { getErrorState } from '@miya/kernel';
import { createBankCachedAsyncThunk } from '@/config/stores/thunks/CreateBankAsyncThunks';
import { FetchSlipCommand } from './FetchSlipCommand';
import { FetchSlipResponse } from './FetchSlipResponse';

export const FetchSlipAsync = createBankCachedAsyncThunk<
  FetchSlipResponse,
  FetchSlipCommand
>(
  'settlements/fetchSlip',
  async ({ id }, { extra, rejectWithValue }) => {
    try {
      return await extra.settlementGateway.fetchSlip(id);
    } catch (error) {
      return rejectWithValue(getErrorState(error));
    }
  },
  {
    key: (arg) => `slip:${arg.id}`,
    tags: (arg) => ['Slip', `Slip:${arg.id}`],
    ttlMs: 30_000,
  },
);
