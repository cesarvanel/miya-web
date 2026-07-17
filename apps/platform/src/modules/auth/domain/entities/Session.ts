export const PlatformUserRole = { Owner: 'Owner', ReadOnly: 'ReadOnly' } as const;
export type PlatformUserRole = (typeof PlatformUserRole)[keyof typeof PlatformUserRole];

export interface SessionUser {
  id: string;
  fullName: string;
  role: PlatformUserRole;
  email: string;
}

export interface Session {
  user: SessionUser;
  /** ISO. */
  expiresAt: string;
}
