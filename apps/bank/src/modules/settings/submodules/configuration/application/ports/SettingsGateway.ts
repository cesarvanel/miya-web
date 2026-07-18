import type { ChangeLogEntry } from '@miya/kernel';
import type {
  BankSettings,
  CollectionRules,
  ContributionPlan,
  CustodyFees,
  InstitutionIdentity,
  Validator,
} from '../../domain/entities/BankSettings';

export interface UpsertPlanInput {
  id?: string;
  floorAmount: number;
  frequencyLabel: string;
}

export interface SettingsGateway {
  fetch: () => Promise<{ settings: BankSettings }>;
  updateIdentity: (changes: Partial<InstitutionIdentity>) => Promise<void>;
  upsertPlan: (input: UpsertPlanInput) => Promise<{ plan: ContributionPlan }>;
  deactivatePlan: (planId: string) => Promise<void>;
  updateCollectionRules: (changes: Partial<CollectionRules>) => Promise<void>;
  updateCustodyFees: (custodyFees: CustodyFees) => Promise<void>;
  updateValidationChain: (agencyId: string, validators: Validator[]) => Promise<void>;
  fetchChangeLog: () => Promise<{ entries: ChangeLogEntry[] }>;
}
