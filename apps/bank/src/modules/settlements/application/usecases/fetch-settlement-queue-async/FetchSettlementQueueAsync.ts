import { getErrorState, type ForceAbleArg } from '@miya/kernel';
import { createBankCachedAsyncThunk } from '@/config/stores/thunks/CreateBankAsyncThunks';
import { FetchSettlementQueueResponse } from './FetchSettlementQueueResponse';
import { FetchSettlementQueueCommand } from './FetchSettlementQueueCommand';

export const FetchSettlementQueueAsync = createBankCachedAsyncThunk<
  FetchSettlementQueueResponse,
  FetchSettlementQueueCommand
>(
  'settlements/fetchQueue',
  async (_arg, { extra, rejectWithValue }) => {
    try {
      return await extra.settlementGateway.fetchQueue();
    } catch (error) {
      return rejectWithValue(getErrorState(error));
    }
  },
  // Mettre dans une classe du domaine pour que ce soit plus propre
  { key: 'settlements:queue', tags: ['SettlementQueue'], ttlMs: 30_000 },
);
