import { FakeAgentGateway, type AgentsDependencies } from '@/modules/agents';
import { FakeClientGateway, type ClientsDependencies } from '@/modules/clients';
import { FakeCollectionGateway, type CollectionsDependencies } from '@/modules/collections';
import { FakeDashboardGateway, type DashboardDependencies } from '@/modules/dashboard';
import { FakeDisputeGateway, type DisputesDependencies } from '@/modules/disputes';
import { FakeSettingsGateway, type SettingsDependencies } from '@/modules/settings';
import { FakeSettlementGateway, type SettlementsDependencies } from '@/modules/settlements';
import { FakeWithdrawalGateway, type WithdrawalsDependencies } from '@/modules/withdrawals';

export type BankDependencies = SettlementsDependencies &
  DashboardDependencies &
  DisputesDependencies &
  CollectionsDependencies &
  ClientsDependencies &
  AgentsDependencies &
  WithdrawalsDependencies &
  SettingsDependencies;

export const makeBankDependencies = (): BankDependencies => ({
  settlementGateway: new FakeSettlementGateway(),
  dashboardGateway: new FakeDashboardGateway(),
  disputeGateway: new FakeDisputeGateway(),
  collectionGateway: new FakeCollectionGateway(),
  clientGateway: new FakeClientGateway(),
  agentGateway: new FakeAgentGateway(),
  withdrawalGateway: new FakeWithdrawalGateway(),
  settingsGateway: new FakeSettingsGateway(),
});

export const bankDependencies = makeBankDependencies();
