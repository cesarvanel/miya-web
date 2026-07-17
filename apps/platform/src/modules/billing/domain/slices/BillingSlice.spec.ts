import { addDaysIso, invoicesAdapter, InvoiceStatus, PaymentMethod, type Invoice } from '../entities/Invoice';
import { plansAdapter, PlanStatus, type Plan } from '../entities/Plan';
import { billingSlice, BillingActions } from './BillingSlice';

const makeInvoice = (overrides: Partial<Invoice> = {}): Invoice => ({
  id: 'INV-2026-06-0138',
  tenantId: 'coopec-sahel',
  tenantName: 'COOPEC Sahel',
  planId: 'plan-croissance',
  planName: 'Croissance',
  period: 'Juin 2026',
  amount: 120_000,
  issuedAt: '2026-06-14T09:00:00.000Z',
  dueAt: '2026-06-14T09:00:00.000Z',
  status: InvoiceStatus.Overdue,
  reminders: [],
  ...overrides,
});

const makePlan = (overrides: Partial<Plan> = {}): Plan => ({
  id: 'plan-croissance',
  name: 'Croissance',
  monthlyPrice: 120_000,
  limits: { agents: 40, clients: 10_000, agencies: 5 },
  tenantsCount: 12,
  status: PlanStatus.Active,
  ...overrides,
});

const stateWith = (invoices: Invoice[], plans: Plan[] = []) => {
  const initial = billingSlice.reducer(undefined, { type: '@@init' });
  return {
    plans: plansAdapter.setAll(initial.plans, plans),
    invoices: invoicesAdapter.setAll(initial.invoices, invoices),
  };
};

describe('billingSlice', () => {
  describe('markPaid', () => {
    it('marks the invoice Paid, stores the payment and cancels the scheduled suspension', () => {
      const state = stateWith([makeInvoice({ scheduledSuspensionAt: '2026-06-29T09:00:00.000Z' })]);

      const next = billingSlice.reducer(
        state,
        BillingActions.markPaid({
          invoiceId: 'INV-2026-06-0138',
          payment: { receivedAt: '2026-06-25T09:00:00.000Z', method: PaymentMethod.MobileMoney, recordedBy: 'S. Etoa', reference: 'MP1' },
        }),
      );

      const invoice = next.invoices.entities['INV-2026-06-0138'];
      expect(invoice?.status).toBe(InvoiceStatus.Paid);
      expect(invoice?.payment?.method).toBe(PaymentMethod.MobileMoney);
      expect(invoice?.scheduledSuspensionAt).toBeUndefined();
    });
  });

  describe('sendReminder', () => {
    it('appends the reminder and schedules the suspension at dueAt + 15 days when Overdue', () => {
      const state = stateWith([makeInvoice()]);

      const next = billingSlice.reducer(
        state,
        BillingActions.sendReminder({ invoiceId: 'INV-2026-06-0138', by: 'S. Etoa', at: '2026-06-17T09:00:00.000Z' }),
      );

      const invoice = next.invoices.entities['INV-2026-06-0138'];
      expect(invoice?.reminders).toHaveLength(1);
      expect(invoice?.reminders[0]).toMatchObject({ by: 'S. Etoa', sentAt: '2026-06-17T09:00:00.000Z' });
      expect(invoice?.scheduledSuspensionAt).toBe(addDaysIso('2026-06-14T09:00:00.000Z', 15));
    });

    it('does not schedule a suspension for a Pending invoice', () => {
      const state = stateWith([makeInvoice({ status: InvoiceStatus.Pending })]);

      const next = billingSlice.reducer(
        state,
        BillingActions.sendReminder({ invoiceId: 'INV-2026-06-0138', by: 'S. Etoa', at: '2026-06-17T09:00:00.000Z' }),
      );

      expect(next.invoices.entities['INV-2026-06-0138']?.scheduledSuspensionAt).toBeUndefined();
    });
  });

  describe('archivePlan', () => {
    it('is rejected when the plan still has subscribed tenants', () => {
      const state = stateWith([], [makePlan({ tenantsCount: 12 })]);

      const next = billingSlice.reducer(state, BillingActions.archivePlan({ planId: 'plan-croissance' }));

      expect(next.plans.entities['plan-croissance']?.status).toBe(PlanStatus.Active);
    });

    it('archives the plan once no tenant is subscribed', () => {
      const state = stateWith([], [makePlan({ tenantsCount: 0 })]);

      const next = billingSlice.reducer(state, BillingActions.archivePlan({ planId: 'plan-croissance' }));

      expect(next.plans.entities['plan-croissance']?.status).toBe(PlanStatus.Archived);
    });
  });
});
