import type { AdoptionStat } from '../../../domain/entities/AdoptionStat';
import type { BankUsagePoint } from '../../../domain/entities/BankUsagePoint';
import type { SyncHealth } from '../../../domain/entities/SyncHealth';

export interface FetchActivityResponse {
  usage: BankUsagePoint[];
  syncHealth: SyncHealth[];
  adoption: AdoptionStat[];
}
