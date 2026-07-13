import { getErrorState } from '@miya/kernel';
import { createBankCachedAsyncThunk } from '@/config/stores/thunks/CreateBankAsyncThunks';
import { FetchAgentCommand } from './FetchAgentCommand';
import { FetchAgentResponse } from './FetchAgentResponse';

/** Alimente la fiche agent — ttl 60s. */
export const FetchAgentAsync = createBankCachedAsyncThunk<FetchAgentResponse, FetchAgentCommand>(
  'agents/fetchAgent',
  async ({ id }, { extra, rejectWithValue }) => {
    try {
      return await extra.agentGateway.fetchOne(id);
    } catch (error) {
      return rejectWithValue(getErrorState(error));
    }
  },
  { key: (arg) => `agents:one:${arg.id}`, tags: (arg) => ['Agent', `Agent:${arg.id}`], ttlMs: 60_000 },
);
