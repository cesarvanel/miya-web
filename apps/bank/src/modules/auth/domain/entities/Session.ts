export const BankUserRole = { BankAdmin: 'BankAdmin', Supervisor: 'Supervisor' } as const;
export type BankUserRole = (typeof BankUserRole)[keyof typeof BankUserRole];

export interface SessionUser {
  id: string;
  fullName: string;
  role: BankUserRole;
  agency: string;
  email: string;
  phone: string;
}

export interface SessionBank {
  id: string;
  name: string;
}

export interface Session {
  user: SessionUser;
  bank: SessionBank;
  /** ISO. */
  expiresAt: string;
}
