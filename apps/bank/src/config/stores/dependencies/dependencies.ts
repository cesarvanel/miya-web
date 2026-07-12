import { FakeClientGateway, type ClientsDependencies } from '@/modules/clients';
import { FakeCollectionGateway, type CollectionsDependencies } from '@/modules/collections';
import { FakeDashboardGateway, type DashboardDependencies } from '@/modules/dashboard';
import { FakeDisputeGateway, type DisputesDependencies } from '@/modules/disputes';
import { FakeSettlementGateway, type SettlementsDependencies } from '@/modules/settlements';

export type BankDependencies = SettlementsDependencies &
  DashboardDependencies &
  DisputesDependencies &
  CollectionsDependencies &
  ClientsDependencies;

export const makeBankDependencies = (): BankDependencies => ({
  settlementGateway: new FakeSettlementGateway(),
  dashboardGateway: new FakeDashboardGateway(),
  disputeGateway: new FakeDisputeGateway(),
  collectionGateway: new FakeCollectionGateway(),
  clientGateway: new FakeClientGateway(),
});

export const bankDependencies = makeBankDependencies();
