import type { AuthGateway, LoginCredentials, LoginOutcome, ResetTokenCheck } from '../../application/ports/AuthGateway';
import { BankUserRole, type Session, type SessionBank, type SessionUser } from '../../domain/entities/Session';

const MEC_LA_CONFIANCE: SessionBank = { id: 'bank-mec-confiance', name: 'MEC La Confiance' };
const EPARGNE_PLUS: SessionBank = { id: 'bank-epargne-plus', name: 'Épargne Plus SA' };
const MUTUFINANCE: SessionBank = { id: 'bank-mutufinance', name: 'MutuFinance' };

const ANTOINE: SessionUser = {
  id: 'agent-antoine-mbarga',
  fullName: 'Antoine Mbarga',
  role: BankUserRole.Supervisor,
  agency: 'Mokolo',
  email: 'a.mbarga@laconfiance.cm',
  phone: '690227133',
};

const DIANE: SessionUser = {
  id: 'v-diane-ndione',
  fullName: 'Diane Ndione',
  role: BankUserRole.BankAdmin,
  agency: 'Siège · toutes agences',
  email: 'd.ndione@laconfiance.cm',
  phone: '677112233',
};

/** Ex. « a.mbarga » → « a.•••@laconfiance.cm » — garde le préfixe jusqu'au premier « . ». */
const maskIdentifier = (identifier: string): string => {
  const [local, domain] = identifier.split('@');
  if (!domain) {
    return `${identifier.slice(0, 2)}•••`;
  }
  const dotIndex = local.indexOf('.');
  const kept = dotIndex >= 0 ? local.slice(0, dotIndex + 1) : local.slice(0, 1);
  return `${kept}•••@${domain}`;
};

const SESSION_TTL_MS = 12 * 60 * 60 * 1000;

const buildSession = (user: SessionUser, bank: SessionBank): Session => ({
  user,
  bank,
  expiresAt: new Date(Date.now() + SESSION_TTL_MS).toISOString(),
});

const delay = (): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 300));

/** Gateway en mémoire — pas de backend. Latence simulée (300-600ms). */
export class FakeAuthGateway implements AuthGateway {
  private failedAttempts = 0;
  private resetTokens = new Map<string, string>();
  private nextTokenSeq = 1;

  async login({ identifier, password }: LoginCredentials): Promise<LoginOutcome> {
    await delay();
    if (password.length === 0) {
      this.failedAttempts += 1;
      return this.invalidCredentials();
    }
    const normalized = identifier.trim().toLowerCase();
    if (normalized === ANTOINE.email) {
      this.failedAttempts = 0;
      return { kind: 'Success', session: buildSession(ANTOINE, MEC_LA_CONFIANCE) };
    }
    if (normalized === DIANE.email) {
      this.failedAttempts = 0;
      return { kind: 'SelectBank', user: DIANE, banks: [MEC_LA_CONFIANCE, EPARGNE_PLUS, MUTUFINANCE] };
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
          : 'Trop de tentatives. Réinitialisez votre mot de passe pour continuer.',
      remainingAttempts,
    };
  }

  async selectBank(userId: string, bankId: string): Promise<{ session: Session }> {
    await delay();
    const user = userId === DIANE.id ? DIANE : ANTOINE;
    const bank = [MEC_LA_CONFIANCE, EPARGNE_PLUS, MUTUFINANCE].find((candidate) => candidate.id === bankId) ?? MEC_LA_CONFIANCE;
    return { session: buildSession(user, bank) };
  }

  async logout(): Promise<void> {
    await delay();
  }

  /** `__devToken` : le token réel n'est renvoyé que parce qu'aucun email n'est réellement envoyé dans cette démo. */
  async requestPasswordReset(emailOrPhone: string): Promise<{ maskedIdentifier: string; __devToken: string }> {
    await delay();
    const token = `reset-${this.nextTokenSeq++}`;
    this.resetTokens.set(token, emailOrPhone);
    return { maskedIdentifier: maskIdentifier(emailOrPhone), __devToken: token };
  }

  async checkResetToken(token: string): Promise<ResetTokenCheck> {
    await delay();
    if (token === 'expired-demo' || !this.resetTokens.has(token)) {
      return { valid: false };
    }
    return { valid: true, identifier: this.resetTokens.get(token) as string };
  }

  async resetPassword(token: string, _newPassword: string): Promise<void> {
    await delay();
    if (!this.resetTokens.has(token)) {
      throw new Error('Ce lien de réinitialisation est invalide ou a déjà été utilisé.');
    }
    this.resetTokens.delete(token);
  }

  async refreshSession(identifier: string, password: string): Promise<{ session: Session }> {
    await delay();
    if (password.length === 0) {
      throw new Error('Mot de passe incorrect.');
    }
    const user = identifier.trim().toLowerCase() === DIANE.email ? DIANE : ANTOINE;
    return { session: buildSession(user, MEC_LA_CONFIANCE) };
  }
}
