import { FakeClientGateway, type ClientsDependencies } from '@/modules/clients';
import { FakeCollectionGateway, type CollectionsDependencies } from '@/modules/collections';
import { FakeDashboardGateway, type DashboardDependencies } from '@/modules/dashboard';
import { FakeDisputeGateway, type DisputesDependencies } from '@/modules/disputes';
import {
  FakeAgenciesGateway,
  FakeAgentGateway,
  FakeSettingsGateway,
  FakeSupervisionGateway,
  type AgenciesDependencies,
  type AgentsDependencies,
  type SettingsDependencies,
  type SupervisionDependencies,
} from '@/modules/settings';
import { FakeSettlementGateway, type SettlementsDependencies } from '@/modules/settlements';
import { FakeWithdrawalGateway, type WithdrawalsDependencies } from '@/modules/withdrawals';

export type BankDependencies = SettlementsDependencies &
  DashboardDependencies &
  DisputesDependencies &
  CollectionsDependencies &
  ClientsDependencies &
  AgentsDependencies &
  WithdrawalsDependencies &
  SettingsDependencies &
  AgenciesDependencies &
  SupervisionDependencies;

export const makeBankDependencies = (): BankDependencies => ({
  settlementGateway: new FakeSettlementGateway(),
  dashboardGateway: new FakeDashboardGateway(),
  disputeGateway: new FakeDisputeGateway(),
  collectionGateway: new FakeCollectionGateway(),
  clientGateway: new FakeClientGateway(),
  agentGateway: new FakeAgentGateway(),
  withdrawalGateway: new FakeWithdrawalGateway(),
  settingsGateway: new FakeSettingsGateway(),
  agenciesGateway: new FakeAgenciesGateway(),
  supervisionGateway: new FakeSupervisionGateway(),
});

export const bankDependencies = makeBankDependencies();
