import type { FetchRoundDetailResponse } from '../usecases/fetch-round-detail-async/FetchRoundDetailResponse';
import type { FetchRoundsResponse } from '../usecases/fetch-rounds-async/FetchRoundsResponse';

/**
 * MVP en lecture seule : le web OBSERVE les tournées, il ne les modifie pas
 * — les actions de collecte (cotiser, marquer absent/reporté) appartiennent
 * à l'app mobile agent. Pas de `cancelStop`/`reopenRound` ici pour l'instant.
 *
 * Exception à prévoir plus tard (non implémentée) : une annulation
 * administrative d'une collecte erronée par le responsable — probablement
 * `cancelCollection(stopId, reason)`, hors scope de ce MVP.
 */
export interface CollectionGateway {
  fetchRounds: (date: string) => Promise<FetchRoundsResponse>;
  fetchRoundDetail: (roundId: string) => Promise<FetchRoundDetailResponse>;
}
