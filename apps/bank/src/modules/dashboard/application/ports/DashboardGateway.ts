import type { FetchDaySummaryResponse } from '../usecases/fetch-day-summary-async/FetchDaySummaryResponse';

export interface DashboardGateway {
  fetchDaySummary: () => Promise<FetchDaySummaryResponse>;
}
