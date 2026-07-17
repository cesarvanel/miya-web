import type { PlanLimits } from '../../../domain/entities/Plan';

export interface UpdatePlanCommand {
  planId: string;
  monthlyPrice: number;
  limits: PlanLimits;
}
