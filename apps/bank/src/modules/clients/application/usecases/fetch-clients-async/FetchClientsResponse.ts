import type { Client } from '../../../domain/entities/Client';

export interface FetchClientsResponse {
  clients: Client[];
  /** Nombre de clients actifs affiché dans l'en-tête (maquette : « 1 284 ») — display only, indépendant de la pagination réelle. */
  totalActiveClientsLabel: number;
}
