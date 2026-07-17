import { BillingSelectors } from './domain/selectors/Selectors';
import { billingSlice } from './domain/slices/BillingSlice';

// Types de domaine
export { InvoiceStatus, PaymentMethod, addDaysIso, scheduleSuspensionFromDueDate } from './domain/entities/Invoice';
export type { Invoice, InvoicePayment, InvoiceReminder } from './domain/entities/Invoice';
export { PlanStatus } from './domain/entities/Plan';
export type { Plan, PlanLimits, PlanName } from './domain/entities/Plan';

// Events (le module tenants s'y abonne via cet index)
export { invoicePaid } from './domain/events';
export type { InvoicePaidEvent } from './domain/events';

// Reducer (branché dans root-reducer)
export const billingReducer = billingSlice.reducer;

// Selectors — groupés, comme prescrit par CLAUDE.md
export const billingSelectors = {
  ...BillingSelectors,
};
export { computeMrr } from './domain/selectors/Selectors';
export type { InvoiceStatusFilter, InvoicesFilter } from './domain/selectors/Selectors';

// Use cases
export { FetchBillingAsync } from './application/usecases/fetch-billing-async/FetchBillingAsync';
export type { FetchBillingResponse } from './application/usecases/fetch-billing-async/FetchBillingResponse';
export { UpdatePlanAsync } from './application/usecases/update-plan-async/UpdatePlanAsync';
export type { UpdatePlanCommand } from './application/usecases/update-plan-async/UpdatePlanCommand';
export { MarkInvoicePaidAsync } from './application/usecases/mark-invoice-paid-async/MarkInvoicePaidAsync';
export type { MarkInvoicePaidCommand } from './application/usecases/mark-invoice-paid-async/MarkInvoicePaidCommand';
export { SendReminderAsync } from './application/usecases/send-reminder-async/SendReminderAsync';
export type { SendReminderCommand } from './application/usecases/send-reminder-async/SendReminderCommand';

// Ports (types utilisés par la composition root)
export type { BillingDependencies } from './application/ports/BillingDependencies';
export type { BillingGateway } from './application/ports/BillingGateway';

// Infrastructure (instanciée par la composition root)
export { FakeBillingGateway } from './infrastructure/gateways/FakeBillingGateway';
export { planFixtures, invoiceFixtures } from './infrastructure/fixtures/billingFixtures';

// Vues (routées par config/router.tsx)
export { BillingPage } from './infrastructure/views/index/BillingPage';

// Modales (montées globalement dans le layout)
export { EditPlanModal } from './infrastructure/views/modal/EditPlanModal';
export { MarkInvoicePaidModal } from './infrastructure/views/modal/MarkInvoicePaidModal';
export { SendReminderModal } from './infrastructure/views/modal/SendReminderModal';
