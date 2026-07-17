import type { Invoice, PaymentMethod } from '../../domain/entities/Invoice';
import type { Plan, PlanLimits } from '../../domain/entities/Plan';

export interface UpdatePlanCommand {
  planId: string;
  monthlyPrice: number;
  limits: PlanLimits;
}

export interface MarkInvoicePaidCommand {
  invoiceId: string;
  method: PaymentMethod;
  /** ISO. */
  receivedAt: string;
  reference?: string;
}

export interface BillingGateway {
  fetchPlans: () => Promise<Plan[]>;
  fetchInvoices: () => Promise<Invoice[]>;
  updatePlan: (command: UpdatePlanCommand) => Promise<Plan>;
  archivePlan: (planId: string) => Promise<void>;
  markInvoicePaid: (command: MarkInvoicePaidCommand) => Promise<Invoice>;
  sendReminder: (invoiceId: string) => Promise<Invoice>;
}
