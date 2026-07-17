import type { Invoice } from '../../../domain/entities/Invoice';
import type { Plan } from '../../../domain/entities/Plan';

export interface FetchBillingResponse {
  plans: Plan[];
  invoices: Invoice[];
}
