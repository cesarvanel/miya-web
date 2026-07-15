import type { Session, SessionBank, SessionUser } from '../../domain/entities/Session';

export interface LoginCredentials {
  /** Email ou téléphone. */
  identifier: string;
  password: string;
}

export type LoginOutcome =
  | { kind: 'Success'; session: Session }
  | { kind: 'SelectBank'; user: SessionUser; banks: SessionBank[] }
  | { kind: 'InvalidCredentials'; message: string; remainingAttempts: number };

export type ResetTokenCheck = { valid: true; identifier: string } | { valid: false };

export interface AuthGateway {
  login: (credentials: LoginCredentials) => Promise<LoginOutcome>;
  /** Complète la connexion après l'écran de sélection d'établissement (compte multi-banques). */
  selectBank: (userId: string, bankId: string) => Promise<{ session: Session }>;
  logout: () => Promise<void>;
  /** `__devToken` : le lien de réinitialisation n'est pas réellement envoyé par email dans cette démo. */
  requestPasswordReset: (emailOrPhone: string) => Promise<{ maskedIdentifier: string; __devToken: string }>;
  checkResetToken: (token: string) => Promise<ResetTokenCheck>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  /** Modale « Session expirée » — re-saisie du mot de passe seul, prolonge la session courante. */
  refreshSession: (identifier: string, password: string) => Promise<{ session: Session }>;
}
