import { createAction } from '@reduxjs/toolkit';

export interface InvoicePaidEvent {
  invoiceId: string;
  tenantId: string;
  tenantName: string;
  amount: number;
  /** ISO. */
  at: string;
  recordedBy: string;
  recordedById: string;
}

/**
 * Events de domaine — le module tenants s'abonne à `invoicePaid` (repasse
 * `billingStatus` à `UpToDate`) et le module activity s'abonne aux trois pour
 * construire sa piste d'audit en direct, tous via cet index public. billing
 * n'importe rien en retour : dépendance à sens unique.
 */
export const invoicePaid = createAction<InvoicePaidEvent>('billing/invoicePaid');

export interface PlanUpdatedEvent {
  planId: string;
  planName: string;
  previousMonthlyPrice: number;
  monthlyPrice: number;
  by: string;
  byId: string;
  /** ISO. */
  at: string;
}

export const planUpdated = createAction<PlanUpdatedEvent>('billing/planUpdated');

export interface ReminderSentEvent {
  invoiceId: string;
  tenantId: string;
  tenantName: string;
  by: string;
  byId: string;
  /** ISO. */
  at: string;
}

export const reminderSent = createAction<ReminderSentEvent>('billing/reminderSent');
