import { getErrorState } from '@miya/kernel';
import { createBankCachedAsyncThunk } from '@/config/stores/thunks/CreateBankAsyncThunks';
import { FetchDisputesCommand } from './FetchDisputesCommand';
import { FetchDisputesResponse } from './FetchDisputesResponse';

/** Alimente le listing (ouvertes + résolues) et la pastille de nav « Contestations ». */
export const FetchDisputesAsync = createBankCachedAsyncThunk<
  FetchDisputesResponse,
  FetchDisputesCommand
>(
  'disputes/fetchDisputes',
  async (_arg, { extra, rejectWithValue }) => {
    try {
      return await extra.disputeGateway.fetchAll();
    } catch (error) {
      return rejectWithValue(getErrorState(error));
    }
  },
  { key: 'disputes:all', tags: ['Disputes'], ttlMs: 30_000 },
);
