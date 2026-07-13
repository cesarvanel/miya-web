import type { DayOfWeek } from '../../../domain/entities/SavingsPlan';

export interface UpdateSavingsPlanCommand {
  id: string;
  amountPerCollectionDay: number;
  collectionDays: DayOfWeek[];
}
