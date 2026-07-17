import { LoginAsync } from '@/modules/auth';
import { makePlatformDependencies } from '@/config/dependencies';
import { makePlatformStore } from '@/config/store';
import { FetchTenantsAsync } from '../fetch-tenants-async/FetchTenantsAsync';
import { ReactivateTenantAsync } from '../reactivate-tenant-async/ReactivateTenantAsync';
import { SuspendTenantAsync } from './SuspendTenantAsync';

const makeStore = () => makePlatformStore(makePlatformDependencies());

describe('SuspendTenantAsync / ReactivateTenantAsync', () => {
  it('suspends COOPEC Sahel with a reason, prepends a journal event, then reactivates it', async () => {
    const store = makeStore();
    await store.dispatch(LoginAsync({ identifier: 'cesar@miya.cm', password: 'demo' }));
    await store.dispatch(FetchTenantsAsync());

    const before = store.getState().tenants.tenants.entities['coopec-sahel'];
    expect(before?.status).toBe('Active');
    expect(before?.billingStatus).toBe('Overdue');

    const suspendResult = await store.dispatch(
      SuspendTenantAsync({ tenantId: 'coopec-sahel', reason: "Impayé d'abonnement depuis 12 jours." }),
    );
    expect(suspendResult.meta.requestStatus).toBe('fulfilled');

    const suspended = store.getState().tenants.tenants.entities['coopec-sahel'];
    expect(suspended?.status).toBe('Suspended');
    expect(suspended?.suspension?.reason).toBe("Impayé d'abonnement depuis 12 jours.");
    expect(suspended?.suspension?.by).toBe('César Vanel');

    const events = Object.values(store.getState().tenants.events.entities);
    const latestEvent = events.find((event) => event?.tenantId === 'coopec-sahel' && event.kind === 'Suspended');
    expect(latestEvent?.summary).toContain('César Vanel');

    const reactivateResult = await store.dispatch(ReactivateTenantAsync({ tenantId: 'coopec-sahel' }));
    expect(reactivateResult.meta.requestStatus).toBe('fulfilled');

    const reactivated = store.getState().tenants.tenants.entities['coopec-sahel'];
    expect(reactivated?.status).toBe('Active');
    expect(reactivated?.suspension).toBeUndefined();
  });
});
