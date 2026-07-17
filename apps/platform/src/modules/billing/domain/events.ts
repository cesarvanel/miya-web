import { createAction } from '@reduxjs/toolkit';

export interface InvoicePaidEvent {
  invoiceId: string;
  tenantId: string;
  tenantName: string;
  amount: number;
  /** ISO. */
  at: string;
  recordedBy: string;
}

/**
 * Event de domaine dispatché par `MarkInvoicePaidAsync` — le module tenants s'y
 * abonne (extraReducer sur cette action, importée via cet index public) pour
 * repasser son `billingStatus` à `UpToDate` et journaliser l'événement, sans
 * que billing ait besoin de connaître les entrailles de tenants.
 */
export const invoicePaid = createAction<InvoicePaidEvent>('billing/invoicePaid');
