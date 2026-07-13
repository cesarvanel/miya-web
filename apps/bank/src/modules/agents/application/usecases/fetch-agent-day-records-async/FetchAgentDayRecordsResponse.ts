import type { AgentDayRecord } from '../../../domain/entities/AgentDayRecord';

export interface FetchAgentDayRecordsResponse {
  records: AgentDayRecord[];
}
