/** Les 3 alertes PLATEFORME (overview/billing/activity) — pas les alertes bank. */
export interface PlatformNotificationPreferences {
  paymentOverdue: boolean;
  trialEndingSoon: boolean;
  syncAlerts: boolean;
}

export interface ProfilePreferences {
  notifications: PlatformNotificationPreferences;
}

export interface ActiveSession {
  id: string;
  /** Ex. « Ordinateur », « Miya Mobile ». */
  device: string;
  /** Ex. « Chrome · Windows ». */
  browser: string;
  /** Ex. « Yaoundé · maintenant », « il y a 3 h ». */
  lastActiveAt: string;
  isCurrent: boolean;
}

/**
 * PAS d'entité RecentAction ici : le journal personnel se DÉRIVE du journal
 * d'audit du module activity (AuditEntry), filtré sur l'acteur courant — une
 * seule source d'actions, jamais dupliquée (voir domain/selectors/Selectors.ts).
 */
