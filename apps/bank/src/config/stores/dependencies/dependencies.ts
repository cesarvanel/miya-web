import { FakeCollectionGateway, type CollectionsDependencies } from '@/modules/collections';
import { FakeDashboardGateway, type DashboardDependencies } from '@/modules/dashboard';
import { FakeDisputeGateway, type DisputesDependencies } from '@/modules/disputes';
import { FakeSettlementGateway, type SettlementsDependencies } from '@/modules/settlements';

export type BankDependencies = SettlementsDependencies &
  DashboardDependencies &
  DisputesDependencies &
  CollectionsDependencies;

export const makeBankDependencies = (): BankDependencies => ({
  settlementGateway: new FakeSettlementGateway(),
  dashboardGateway: new FakeDashboardGateway(),
  disputeGateway: new FakeDisputeGateway(),
  collectionGateway: new FakeCollectionGateway(),
});

export const bankDependencies = makeBankDependencies();
