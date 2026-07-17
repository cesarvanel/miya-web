import type { Session } from '../../domain/entities/Session';

export interface LoginCredentials {
  /** Email. */
  identifier: string;
  password: string;
}

export type LoginOutcome =
  | { kind: 'Success'; session: Session }
  | { kind: 'InvalidCredentials'; message: string; remainingAttempts: number };

export interface AuthGateway {
  login: (credentials: LoginCredentials) => Promise<LoginOutcome>;
  logout: () => Promise<void>;
}
