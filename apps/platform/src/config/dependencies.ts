import { FakeAuthGateway, type AuthDependencies } from '@/modules/auth';
import { FakeOverviewGateway, type OverviewDependencies } from '@/modules/overview';
import { FakeTenantGateway, type TenantsDependencies } from '@/modules/tenants';

/**
 * Dépendances injectées dans les use cases (thunks) via `extra`.
 * Même pattern que bank : PlatformDependencies = intersection des contrats
 * `application/ports/<Module>Dependencies` des modules ; la composition root
 * instancie les adapters concrets (Http en prod, Fake en dev/tests).
 */
export type PlatformDependencies = AuthDependencies & OverviewDependencies & TenantsDependencies;

export const makePlatformDependencies = (): PlatformDependencies => ({
  authGateway: new FakeAuthGateway(),
  overviewGateway: new FakeOverviewGateway(),
  tenantGateway: new FakeTenantGateway(),
});
