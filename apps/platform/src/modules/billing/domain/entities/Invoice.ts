import { createEntityAdapter } from '@reduxjs/toolkit';
import type { PlanName } from './Plan';

export const InvoiceStatus = { Paid: 'Paid', Pending: 'Pending', Overdue: 'Overdue' } as const;
export type InvoiceStatus = (typeof InvoiceStatus)[keyof typeof InvoiceStatus];

export const PaymentMethod = { BankTransfer: 'BankTransfer', MobileMoney: 'MobileMoney' } as const;
export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod];

export interface InvoicePayment {
  /** ISO. */
  receivedAt: string;
  method: PaymentMethod;
  recordedBy: string;
  reference?: string;
}

export interface InvoiceReminder {
  /** ISO. */
  sentAt: string;
  by: string;
}

export interface Invoice {
  id: string;
  tenantId: string;
  tenantName: string;
  planId: string;
  planName: PlanName;
  /** Ex. "Juillet 2026". */
  period: string;
  amount: number;
  issuedAt: string;
  dueAt: string;
  status: InvoiceStatus;
  payment?: InvoicePayment;
  reminders: InvoiceReminder[];
  /** Posée à la relance d'une facture Overdue : échéance + 15 jours ; annulée dès le paiement. */
  scheduledSuspensionAt?: string;
}

export const invoicesAdapter = createEntityAdapter<Invoice>({
  sortComparer: (a, b) => b.issuedAt.localeCompare(a.issuedAt),
});

/** Règle d'escalade partagée par le slice, la gateway et les fixtures : échéance + 15 jours. */
export const addDaysIso = (iso: string, days: number): string =>
  new Date(new Date(iso).getTime() + days * 24 * 60 * 60 * 1000).toISOString();

export const scheduleSuspensionFromDueDate = (dueAt: string): string => addDaysIso(dueAt, 15);
