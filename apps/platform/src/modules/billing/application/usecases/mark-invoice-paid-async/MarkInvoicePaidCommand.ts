import type { PaymentMethod } from '../../../domain/entities/Invoice';

export interface MarkInvoicePaidCommand {
  invoiceId: string;
  method: PaymentMethod;
  /** ISO. */
  receivedAt: string;
  reference?: string;
}
