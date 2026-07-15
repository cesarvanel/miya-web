import type { Agency } from '../../../domain/entities/Agency';
import type { CollectionZone } from '../../../domain/entities/CollectionZone';

export interface FetchAgenciesResponse {
  agencies: Agency[];
  zones: CollectionZone[];
}
