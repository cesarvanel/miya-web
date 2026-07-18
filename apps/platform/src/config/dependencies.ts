import { FakeActivityGateway, type ActivityDependencies } from '@/modules/activity';
import { FakeAuthGateway, type AuthDependencies } from '@/modules/auth';
import { FakeBillingGateway, type BillingDependencies } from '@/modules/billing';
import { FakeOverviewGateway, type OverviewDependencies } from '@/modules/overview';
import { FakePlatformProfileGateway, type PlatformProfileDependencies } from '@/modules/profile';
import { FakePlatformSettingsGateway, type PlatformSettingsDependencies } from '@/modules/settings-platform';
import { FakeTenantGateway, type TenantsDependencies } from '@/modules/tenants';

/**
 * Dépendances injectées dans les use cases (thunks) via `extra`.
 * Même pattern que bank : PlatformDependencies = intersection des contrats
 * `application/ports/<Module>Dependencies` des modules ; la composition root
 * instancie les adapters concrets (Http en prod, Fake en dev/tests).
 */
export type PlatformDependencies = AuthDependencies &
  OverviewDependencies &
  TenantsDependencies &
  BillingDependencies &
  ActivityDependencies &
  PlatformSettingsDependencies &
  PlatformProfileDependencies;

export const makePlatformDependencies = (): PlatformDependencies => ({
  authGateway: new FakeAuthGateway(),
  overviewGateway: new FakeOverviewGateway(),
  tenantGateway: new FakeTenantGateway(),
  billingGateway: new FakeBillingGateway(),
  activityGateway: new FakeActivityGateway(),
  platformSettingsGateway: new FakePlatformSettingsGateway(),
  platformProfileGateway: new FakePlatformProfileGateway(),
});
