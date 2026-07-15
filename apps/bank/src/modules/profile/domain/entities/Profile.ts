export interface NotificationPreferences {
  disputeOpened: boolean;
  settlementPending: boolean;
  capApproaching: boolean;
}

export interface ProfilePreferences {
  notifications: NotificationPreferences;
}

export interface ActiveSession {
  id: string;
  /** Ex. « Miya Mobile », « Ordinateur ». */
  device: string;
  /** Ex. « Chrome · Windows ». */
  browser: string;
  /** Ex. « Yaoundé · maintenant », « il y a 3 h ». */
  lastActiveAt: string;
  isCurrent: boolean;
}

export const RecentActionKind = {
  SettlementValidated: 'SettlementValidated',
  DisputeResolved: 'DisputeResolved',
  WithdrawalApproved: 'WithdrawalApproved',
  AgentCreated: 'AgentCreated',
  ConfigChanged: 'ConfigChanged',
  DeviceRevoked: 'DeviceRevoked',
  ZoneCreated: 'ZoneCreated',
} as const;
export type RecentActionKind = (typeof RecentActionKind)[keyof typeof RecentActionKind];

export interface RecentAction {
  /** ISO. */
  at: string;
  kind: RecentActionKind;
  summary: string;
}
