export interface UpsertPlanCommand {
  /** Absent → création d'un nouveau plan. */
  id?: string;
  floorAmount: number;
  frequencyLabel: string;
}
