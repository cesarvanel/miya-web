import type { Session } from '../../../domain/entities/Session';

export interface RefreshSessionResponse {
  session: Session;
}
