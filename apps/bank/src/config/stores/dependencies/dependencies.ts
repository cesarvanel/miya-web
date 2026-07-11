import { FakeDashboardGateway, type DashboardDependencies } from '@/modules/dashboard';
import { FakeSettlementGateway, type SettlementsDependencies } from '@/modules/settlements';

export type BankDependencies = SettlementsDependencies & DashboardDependencies;

export const makeBankDependencies = (): BankDependencies => ({
  settlementGateway: new FakeSettlementGateway(),
  dashboardGateway: new FakeDashboardGateway(),
});

export const bankDependencies = makeBankDependencies();
