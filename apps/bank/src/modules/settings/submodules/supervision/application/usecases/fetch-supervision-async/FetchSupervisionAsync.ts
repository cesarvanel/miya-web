import { getErrorState } from '@miya/kernel';
import { createBankCachedAsyncThunk } from '@/config/stores/thunks/CreateBankAsyncThunks';
import { FetchSupervisionCommand } from './FetchSupervisionCommand';
import { FetchSupervisionResponse } from './FetchSupervisionResponse';

/** Alimente le tableau de bord Supervision — ttl 60s. */
export const FetchSupervisionAsync = createBankCachedAsyncThunk<FetchSupervisionResponse, FetchSupervisionCommand>(
  'supervision/fetchSupervision',
  async (_arg, { extra, rejectWithValue }) => {
    try {
      return await extra.supervisionGateway.fetch();
    } catch (error) {
      return rejectWithValue(getErrorState(error));
    }
  },
  { key: 'supervision:all', tags: ['Supervision'], ttlMs: 60_000 },
);
