import type { SupervisionDaySnapshot, SupervisionMonthSnapshot } from '../../../domain/entities/Supervision';

export interface FetchSupervisionResponse {
  day: SupervisionDaySnapshot;
  month: SupervisionMonthSnapshot;
}
