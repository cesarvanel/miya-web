import { getErrorState } from '@miya/kernel';
import { createBankCachedAsyncThunk } from '@/config/stores/thunks/CreateBankAsyncThunks';
import { FetchAgentsCommand } from './FetchAgentsCommand';
import { FetchAgentsResponse } from './FetchAgentsResponse';

/** Alimente le listing des agents & responsables — ttl 60s. */
export const FetchAgentsAsync = createBankCachedAsyncThunk<FetchAgentsResponse, FetchAgentsCommand>(
  'agents/fetchAgents',
  async (_arg, { extra, rejectWithValue }) => {
    try {
      return await extra.agentGateway.fetchAll();
    } catch (error) {
      return rejectWithValue(getErrorState(error));
    }
  },
  { key: 'agents:all', tags: ['Agents'], ttlMs: 60_000 },
);
