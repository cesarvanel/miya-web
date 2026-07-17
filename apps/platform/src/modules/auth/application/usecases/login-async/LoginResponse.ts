import type { LoginOutcome } from '../../ports/AuthGateway';

export interface LoginResponse {
  outcome: LoginOutcome;
}
