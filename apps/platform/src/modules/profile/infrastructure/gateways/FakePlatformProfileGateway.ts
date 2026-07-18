import type { PersonalInfoInput, PlatformProfileGateway, ProfileSnapshot } from '../../application/ports/PlatformProfileGateway';
import type { ActiveSession, PlatformNotificationPreferences } from '../../domain/entities/Profile';

/** Le compte de démo Owner — ce poste + un mobile, préférences par défaut toutes actives. */
const seedSnapshot = (): ProfileSnapshot => ({
  preferences: {
    notifications: { paymentOverdue: true, trialEndingSoon: true, syncAlerts: true },
  },
  activeSessions: [
    { id: 'session-1', device: 'Ordinateur', browser: 'Chrome · Windows', lastActiveAt: 'Yaoundé · maintenant', isCurrent: true },
    { id: 'session-2', device: 'Miya Mobile', browser: 'Android', lastActiveAt: 'Yaoundé · il y a 3 h', isCurrent: false },
  ],
});

const delay = (): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 300));

/** Gateway en mémoire — pas de backend. Latence simulée (300-600ms). */
export class FakePlatformProfileGateway implements PlatformProfileGateway {
  private snapshot: ProfileSnapshot = seedSnapshot();

  async fetchProfile(_userId: string): Promise<ProfileSnapshot> {
    await delay();
    return structuredClone(this.snapshot);
  }

  async updatePersonalInfo(_changes: PersonalInfoInput): Promise<void> {
    await delay();
  }

  async changePassword(_current: string, _next: string): Promise<void> {
    await delay();
  }

  async updateNotificationPrefs(prefs: PlatformNotificationPreferences): Promise<void> {
    await delay();
    this.snapshot.preferences.notifications = prefs;
  }

  async revokeSession(sessionId: string): Promise<void> {
    await delay();
    this.snapshot.activeSessions = this.snapshot.activeSessions.filter((session: ActiveSession) => session.id !== sessionId);
  }
}
