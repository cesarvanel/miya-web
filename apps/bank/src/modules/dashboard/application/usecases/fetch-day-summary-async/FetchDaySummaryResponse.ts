import type { ActivityEvent } from '../../../domain/entities/ActivityEvent';
import type { AgentDaySummary } from '../../../domain/entities/AgentDaySummary';

export interface FetchDaySummaryResponse {
  agents: AgentDaySummary[];
  activity: ActivityEvent[];
}
