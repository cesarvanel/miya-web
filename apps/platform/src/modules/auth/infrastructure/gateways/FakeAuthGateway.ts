import type { AuthGateway, LoginCredentials, LoginOutcome } from '../../application/ports/AuthGateway';
import { PlatformUserRole, type Session, type SessionUser } from '../../domain/entities/Session';

const CESAR: SessionUser = {
  id: 'super-admin-cesar',
  fullName: 'César Vanel',
  role: PlatformUserRole.Owner,
  email: 'cesar@miya.cm',
  phone: '+237 6 98 44 21 07',
};

const SESSION_TTL_MS = 12 * 60 * 60 * 1000;

const buildSession = (user: SessionUser): Session => ({
  user,
  expiresAt: new Date(Date.now() + SESSION_TTL_MS).toISOString(),
});

const delay = (): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 300));

/** Gateway en mémoire — pas de backend. Latence simulée (300-600ms). */
export class FakeAuthGateway implements AuthGateway {
  private failedAttempts = 0;

  async login({ identifier, password }: LoginCredentials): Promise<LoginOutcome> {
    await delay();
    if (password.length === 0) {
      this.failedAttempts += 1;
      return this.invalidCredentials();
    }
    const normalized = identifier.trim().toLowerCase();
    if (normalized === CESAR.email) {
      this.failedAttempts = 0;
      return { kind: 'Success', session: buildSession(CESAR) };
    }
    this.failedAttempts += 1;
    return this.invalidCredentials();
  }

  private invalidCredentials(): LoginOutcome {
    const remainingAttempts = Math.max(0, 3 - this.failedAttempts);
    return {
      kind: 'InvalidCredentials',
      message:
        remainingAttempts > 0
          ? 'Vérifiez votre email et votre mot de passe.'
          : 'Trop de tentatives. Réessayez plus tard.',
      remainingAttempts,
    };
  }

  async logout(): Promise<void> {
    await delay();
  }
}
