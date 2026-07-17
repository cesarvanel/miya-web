import { LoginAsync } from '@/modules/auth';
import { FetchTenantsAsync } from '@/modules/tenants';
import { makePlatformDependencies } from '@/config/dependencies';
import { makePlatformStore } from '@/config/store';
import { FetchBillingAsync } from '../fetch-billing-async/FetchBillingAsync';
import { PaymentMethod } from '../../../domain/entities/Invoice';
import { MarkInvoicePaidAsync } from './MarkInvoicePaidAsync';

const makeStore = () => makePlatformStore(makePlatformDependencies());

describe('MarkInvoicePaidAsync', () => {
  it('pays the overdue COOPEC Sahel invoice and the tenants module reacts to the invoicePaid event', async () => {
    const store = makeStore();
    await store.dispatch(LoginAsync({ identifier: 'cesar@miya.cm', password: 'demo' }));
    await store.dispatch(FetchBillingAsync());
    await store.dispatch(FetchTenantsAsync());

    const beforeTenant = store.getState().tenants.tenants.entities['coopec-sahel'];
    expect(beforeTenant?.billingStatus).toBe('Overdue');

    const result = await store.dispatch(
      MarkInvoicePaidAsync({
        invoiceId: 'INV-2026-06-0138',
        method: PaymentMethod.MobileMoney,
        receivedAt: new Date().toISOString(),
        reference: 'MP-TEST-1',
      }),
    );
    expect(result.meta.requestStatus).toBe('fulfilled');

    const invoice = store.getState().billing.invoices.entities['INV-2026-06-0138'];
    expect(invoice?.status).toBe('Paid');
    expect(invoice?.payment?.method).toBe('MobileMoney');
    expect(invoice?.scheduledSuspensionAt).toBeUndefined();

    const afterTenant = store.getState().tenants.tenants.entities['coopec-sahel'];
    expect(afterTenant?.billingStatus).toBe('UpToDate');

    const events = Object.values(store.getState().tenants.events.entities);
    const invoicePaidEvent = events.find((event) => event?.tenantId === 'coopec-sahel' && event.kind === 'InvoicePaid');
    expect(invoicePaidEvent?.summary).toContain('120 000 FCFA');
  });
});
