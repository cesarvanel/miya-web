import type { BillingGateway, MarkInvoicePaidCommand, UpdatePlanCommand } from '../../application/ports/BillingGateway';
import { InvoiceStatus, scheduleSuspensionFromDueDate, type Invoice } from '../../domain/entities/Invoice';
import { PlanStatus, type Plan } from '../../domain/entities/Plan';
import { invoiceFixtures, planFixtures } from '../fixtures/billingFixtures';

const delay = (): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 300));

const findPlanIndex = (planId: string): number => planFixtures.findIndex((candidate) => candidate.id === planId);
const findInvoiceIndex = (invoiceId: string): number => invoiceFixtures.findIndex((candidate) => candidate.id === invoiceId);

/**
 * Gateway en mémoire — lit/écrit les fixtures partagées du module (`planFixtures`,
 * `invoiceFixtures`). Ne renvoie et ne stocke jamais les objets de fixture PAR
 * RÉFÉRENCE (Redux/Immer gèle les objets qui entrent dans le store) : lecture =
 * clone, écriture = remplacement d'élément — même règle que `FakeTenantGateway`.
 */
export class FakeBillingGateway implements BillingGateway {
  async fetchPlans(): Promise<Plan[]> {
    await delay();
    return planFixtures.map((plan) => ({ ...plan, limits: { ...plan.limits } }));
  }

  async fetchInvoices(): Promise<Invoice[]> {
    await delay();
    return invoiceFixtures.map((invoice) => ({
      ...invoice,
      reminders: invoice.reminders.map((reminder) => ({ ...reminder })),
      payment: invoice.payment ? { ...invoice.payment } : undefined,
    }));
  }

  async updatePlan(command: UpdatePlanCommand): Promise<Plan> {
    await delay();
    const index = findPlanIndex(command.planId);
    if (index === -1) {
      throw new Error('Plan introuvable.');
    }
    const updated: Plan = { ...planFixtures[index], monthlyPrice: command.monthlyPrice, limits: { ...command.limits } };
    planFixtures[index] = updated;
    return { ...updated, limits: { ...updated.limits } };
  }

  async archivePlan(planId: string): Promise<void> {
    await delay();
    const index = findPlanIndex(planId);
    if (index === -1) {
      throw new Error('Plan introuvable.');
    }
    if (planFixtures[index].tenantsCount > 0) {
      throw new Error('Impossible d’archiver un plan encore souscrit par des banques.');
    }
    planFixtures[index] = { ...planFixtures[index], status: PlanStatus.Archived };
  }

  async markInvoicePaid(command: MarkInvoicePaidCommand): Promise<Invoice> {
    await delay();
    const index = findInvoiceIndex(command.invoiceId);
    if (index === -1) {
      throw new Error('Facture introuvable.');
    }
    const current = invoiceFixtures[index];
    const updated: Invoice = {
      ...current,
      status: InvoiceStatus.Paid,
      scheduledSuspensionAt: undefined,
      payment: {
        receivedAt: command.receivedAt,
        method: command.method,
        reference: command.reference,
        recordedBy: '',
      },
    };
    invoiceFixtures[index] = updated;
    return { ...updated, reminders: [...updated.reminders] };
  }

  async sendReminder(invoiceId: string): Promise<Invoice> {
    await delay();
    const index = findInvoiceIndex(invoiceId);
    if (index === -1) {
      throw new Error('Facture introuvable.');
    }
    const current = invoiceFixtures[index];
    const updated: Invoice = {
      ...current,
      reminders: [...current.reminders, { sentAt: new Date().toISOString(), by: '' }],
      scheduledSuspensionAt:
        current.status === InvoiceStatus.Overdue ? scheduleSuspensionFromDueDate(current.dueAt) : current.scheduledSuspensionAt,
    };
    invoiceFixtures[index] = updated;
    return { ...updated, reminders: [...updated.reminders] };
  }
}
