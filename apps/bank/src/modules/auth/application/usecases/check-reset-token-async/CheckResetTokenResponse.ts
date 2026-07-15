import type { ResetTokenCheck } from '../../ports/AuthGateway';

export interface CheckResetTokenResponse {
  check: ResetTokenCheck;
}
