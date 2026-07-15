import type { SupervisionDaySnapshot, SupervisionMonthSnapshot } from '../../domain/entities/Supervision';

export interface SupervisionGateway {
  fetch: () => Promise<{ day: SupervisionDaySnapshot; month: SupervisionMonthSnapshot }>;
}
