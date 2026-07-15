import type { PersonalInfoInput, ProfileGateway, ProfileSnapshot } from '../../application/ports/ProfileGateway';
import { RecentActionKind, type ActiveSession, type NotificationPreferences } from '../../domain/entities/Profile';

const daysAgo = (days: number): string => {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - days);
  return date.toISOString();
};

/** Antoine Mbarga (Responsable) — maquette A1. */
const seedSupervisorSnapshot = (): ProfileSnapshot => ({
  memberSince: '2024-03-01T00:00:00.000Z',
  preferences: {
    notifications: { disputeOpened: true, settlementPending: true, capApproaching: false },
  },
  activeSessions: [
    { id: 'session-1', device: 'Ordinateur', browser: 'Chrome · Windows', lastActiveAt: 'Yaoundé · maintenant', isCurrent: true },
    { id: 'session-2', device: 'Miya Mobile', browser: 'Android', lastActiveAt: 'Yaoundé · il y a 3 h', isCurrent: false },
  ],
  myRecentActions: [
    { at: daysAgo(0), kind: RecentActionKind.SettlementValidated, summary: 'Reversement validé — Grace Atangana · 128 500 FCFA · bordereau #4471' },
    { at: daysAgo(1), kind: RecentActionKind.DisputeResolved, summary: 'Contestation résolue — en faveur du client' },
    { at: daysAgo(2), kind: RecentActionKind.WithdrawalApproved, summary: 'Retrait autorisé — Bernadette Fouda' },
    { at: daysAgo(3), kind: RecentActionKind.SettlementValidated, summary: 'Reversement validé — Ibrahim Souley' },
  ],
});

/** Diane Ndione (Administrateur) — maquette A2. */
const seedAdminSnapshot = (): ProfileSnapshot => ({
  memberSince: '2023-01-01T00:00:00.000Z',
  preferences: {
    notifications: { disputeOpened: true, settlementPending: false, capApproaching: true },
  },
  activeSessions: [
    { id: 'session-1', device: 'Ordinateur', browser: 'Safari · macOS', lastActiveAt: 'Yaoundé · maintenant', isCurrent: true },
    { id: 'session-2', device: 'Ordinateur', browser: 'Chrome · Windows', lastActiveAt: 'Douala · il y a 2 j', isCurrent: false },
  ],
  myRecentActions: [
    { at: daysAgo(0), kind: RecentActionKind.AgentCreated, summary: 'Agent créé — Cédric Nkoulou' },
    { at: daysAgo(1), kind: RecentActionKind.ConfigChanged, summary: 'Configuration modifiée — plafond de détention (100 000 → 120 000 FCFA)' },
    { at: daysAgo(4), kind: RecentActionKind.DeviceRevoked, summary: 'Appareil révoqué — Ibrahim Souley' },
    { at: daysAgo(6), kind: RecentActionKind.ZoneCreated, summary: 'Zone créée — Essos-Nord' },
  ],
});

const delay = (): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 300));

/** Gateway en mémoire — pas de backend. Latence simulée (300-600ms). */
export class FakeProfileGateway implements ProfileGateway {
  private snapshots = new Map<string, ProfileSnapshot>([
    ['agent-antoine-mbarga', seedSupervisorSnapshot()],
    ['v-diane-ndione', seedAdminSnapshot()],
  ]);

  async fetchProfile(userId: string): Promise<ProfileSnapshot> {
    await delay();
    const snapshot = this.snapshots.get(userId) ?? seedSupervisorSnapshot();
    return structuredClone(snapshot);
  }

  async updatePersonalInfo(_changes: PersonalInfoInput): Promise<void> {
    await delay();
  }

  async changePassword(_current: string, _next: string): Promise<void> {
    await delay();
  }

  async updateNotificationPrefs(prefs: NotificationPreferences): Promise<void> {
    await delay();
    for (const snapshot of this.snapshots.values()) {
      snapshot.preferences.notifications = prefs;
    }
  }

  async revokeSession(sessionId: string): Promise<void> {
    await delay();
    for (const snapshot of this.snapshots.values()) {
      snapshot.activeSessions = snapshot.activeSessions.filter((session: ActiveSession) => session.id !== sessionId);
    }
  }
}
