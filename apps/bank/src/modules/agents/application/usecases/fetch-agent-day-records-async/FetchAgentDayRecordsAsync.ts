import { getErrorState } from '@miya/kernel';
import { createBankCachedAsyncThunk } from '@/config/stores/thunks/CreateBankAsyncThunks';
import { FetchAgentDayRecordsCommand } from './FetchAgentDayRecordsCommand';
import { FetchAgentDayRecordsResponse } from './FetchAgentDayRecordsResponse';

/** Alimente la section « Journées & reversements » de la fiche agent — ttl 60s. */
export const FetchAgentDayRecordsAsync = createBankCachedAsyncThunk<
  FetchAgentDayRecordsResponse,
  FetchAgentDayRecordsCommand
>(
  'agents/fetchAgentDayRecords',
  async ({ agentId }, { extra, rejectWithValue }) => {
    try {
      return await extra.agentGateway.fetchDayRecords(agentId);
    } catch (error) {
      return rejectWithValue(getErrorState(error));
    }
  },
  {
    key: (arg) => `agents:dayRecords:${arg.agentId}`,
    tags: (arg) => ['AgentDayRecords', `AgentDayRecords:${arg.agentId}`],
    ttlMs: 60_000,
  },
);
