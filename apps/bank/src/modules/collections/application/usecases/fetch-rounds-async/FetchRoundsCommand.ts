import type { ForceAbleArg } from '@miya/kernel';

export interface FetchRoundsCommand extends ForceAbleArg {
  /** Date du jour, format ISO (YYYY-MM-DD) — MVP : toujours "aujourd'hui". */
  date: string;
}
