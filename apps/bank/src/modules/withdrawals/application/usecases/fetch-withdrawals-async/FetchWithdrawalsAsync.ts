import { getErrorState } from '@miya/kernel';
import { createBankCachedAsyncThunk } from '@/config/stores/thunks/CreateBankAsyncThunks';
import { FetchWithdrawalsCommand } from './FetchWithdrawalsCommand';
import { FetchWithdrawalsResponse } from './FetchWithdrawalsResponse';

/** Alimente la file des retraits — ttl 30s (plus volatile que les clients/agents). */
export const FetchWithdrawalsAsync = createBankCachedAsyncThunk<
  FetchWithdrawalsResponse,
  FetchWithdrawalsCommand
>(
  'withdrawals/fetchWithdrawals',
  async (_arg, { extra, rejectWithValue }) => {
    try {
      return await extra.withdrawalGateway.fetchAll();
    } catch (error) {
      return rejectWithValue(getErrorState(error));
    }
  },
  { key: 'withdrawals:all', tags: ['Withdrawals'], ttlMs: 30_000 },
);
