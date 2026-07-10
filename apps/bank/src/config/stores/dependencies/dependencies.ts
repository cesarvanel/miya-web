import { FakeSettlementGateway, type SettlementsDependencies } from '@/modules/settlements';

export type BankDependencies = SettlementsDependencies;

export const makeBankDependencies = (): BankDependencies => ({
  settlementGateway: new FakeSettlementGateway(),
});

export const bankDependencies = makeBankDependencies();
