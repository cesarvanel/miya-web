import { LoginAsync } from '@/modules/auth';
import { FetchTenantsAsync, SuspendTenantAsync } from '@/modules/tenants';
import { makePlatformDependencies } from '@/config/dependencies';
import { makePlatformStore } from '@/config/store';
import { selectMyRecentActions } from './Selectors';

const makeStore = () => makePlatformStore(makePlatformDependencies());

describe('profile selectMyRecentActions', () => {
  it('derives from the activity audit log, filtered on the current actor — a tenant suspension played just before appears live', async () => {
    const store = makeStore();
    await store.dispatch(LoginAsync({ identifier: 'cesar@miya.cm', password: 'demo' }));
    await store.dispatch(FetchTenantsAsync());

    // Ni FetchProfileAsync ni FetchAuditLogAsync n'ont jamais été dispatchés :
    // le journal personnel doit malgré tout refléter l'action jouée en direct.
    expect(selectMyRecentActions(store.getState())).toHaveLength(0);

    const result = await store.dispatch(
      SuspendTenantAsync({ tenantId: 'coopec-sahel', reason: "Impayé d'abonnement depuis 12 jours." }),
    );
    expect(result.meta.requestStatus).toBe('fulfilled');

    const myActions = selectMyRecentActions(store.getState());
    expect(myActions).toHaveLength(1);
    expect(myActions[0]?.action).toBe('TenantSuspended');
    expect(myActions[0]?.summary).toContain('COOPEC Sahel');
    expect(myActions[0]?.actor.name).toBe('César Vanel');
  });
});
