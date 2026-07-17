import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import {
  invoicesAdapter,
  InvoiceStatus,
  scheduleSuspensionFromDueDate,
  type Invoice,
  type InvoicePayment,
} from '../entities/Invoice';
import { plansAdapter, PlanStatus, type PlanLimits } from '../entities/Plan';
import { FetchBillingAsync } from '../../application/usecases/fetch-billing-async/FetchBillingAsync';

const initialState = {
  plans: plansAdapter.getInitialState(),
  invoices: invoicesAdapter.getInitialState(),
};

export type BillingState = typeof initialState;

export const billingSlice = createSlice({
  name: 'billing',
  initialState,
  reducers: {
    /** Paiement confirmé — la facture devient Paid, la suspension programmée (le cas échéant) est annulée. */
    markPaid: (state, action: PayloadAction<{ invoiceId: string; payment: InvoicePayment }>) => {
      const { invoiceId, payment } = action.payload;
      if (!state.invoices.entities[invoiceId]) {
        return;
      }
      invoicesAdapter.updateOne(state.invoices, {
        id: invoiceId,
        changes: { status: InvoiceStatus.Paid, payment, scheduledSuspensionAt: undefined },
      });
    },

    /** Relance envoyée ; pose (ou repousse) la suspension programmée à échéance + 15 jours tant que la facture reste Overdue. */
    sendReminder: (state, action: PayloadAction<{ invoiceId: string; by: string; at: string }>) => {
      const { invoiceId, by, at } = action.payload;
      const invoice = state.invoices.entities[invoiceId];
      if (!invoice) {
        return;
      }
      const changes: Partial<Invoice> = { reminders: [...invoice.reminders, { sentAt: at, by }] };
      if (invoice.status === InvoiceStatus.Overdue) {
        changes.scheduledSuspensionAt = scheduleSuspensionFromDueDate(invoice.dueAt);
      }
      invoicesAdapter.updateOne(state.invoices, { id: invoiceId, changes });
    },

    /** Tarif/limites du catalogue — effectifs au prochain cycle de facturation des banques déjà abonnées (non modélisé ici, seul le catalogue change). */
    updatePlan: (
      state,
      action: PayloadAction<{ planId: string; monthlyPrice: number; limits: PlanLimits }>,
    ) => {
      const { planId, monthlyPrice, limits } = action.payload;
      if (!state.plans.entities[planId]) {
        return;
      }
      plansAdapter.updateOne(state.plans, { id: planId, changes: { monthlyPrice, limits } });
    },

    /** Garde-fou : un plan encore souscrit par des banques ne peut pas être archivé. */
    archivePlan: (state, action: PayloadAction<{ planId: string }>) => {
      const plan = state.plans.entities[action.payload.planId];
      if (!plan || plan.tenantsCount > 0) {
        return;
      }
      plansAdapter.updateOne(state.plans, { id: plan.id, changes: { status: PlanStatus.Archived } });
    },
  },

  extraReducers: (builder) => {
    builder.addCase(FetchBillingAsync.fulfilled, (state, action) => {
      plansAdapter.setAll(state.plans, action.payload.plans);
      invoicesAdapter.setAll(state.invoices, action.payload.invoices);
    });
  },
});

export const BillingActions = billingSlice.actions;
