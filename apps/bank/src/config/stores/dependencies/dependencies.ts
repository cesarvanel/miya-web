import { FakeDashboardGateway, type DashboardDependencies } from '@/modules/dashboard';
import { FakeDisputeGateway, type DisputesDependencies } from '@/modules/disputes';
import { FakeSettlementGateway, type SettlementsDependencies } from '@/modules/settlements';

export type BankDependencies = SettlementsDependencies & DashboardDependencies & DisputesDependencies;

export const makeBankDependencies = (): BankDependencies => ({
  settlementGateway: new FakeSettlementGateway(),
  dashboardGateway: new FakeDashboardGateway(),
  disputeGateway: new FakeDisputeGateway(),
});

export const bankDependencies = makeBankDependencies();
