import type { CollectionRound } from '../../../domain/entities/CollectionRound';
import type { RoundStop } from '../../../domain/entities/RoundStop';

export interface FetchRoundDetailResponse {
  round: CollectionRound;
  stops: RoundStop[];
}
