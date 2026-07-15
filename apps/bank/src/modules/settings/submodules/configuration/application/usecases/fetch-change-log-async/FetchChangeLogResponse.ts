import type { ChangeLogEntry } from '../../../domain/entities/ChangeLogEntry';

export interface FetchChangeLogResponse {
  entries: ChangeLogEntry[];
}
