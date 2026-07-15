export interface InstitutionContacts {
  phone: string;
  email: string;
}

export interface InstitutionIdentity {
  name: string;
  city: string;
  /** Ex. « FCFA (XAF) » — non modifiable, affichée pour mémoire seulement. */
  currency: string;
  contacts: InstitutionContacts;
  logoUrl?: string;
  /** Hex — appliquée aux reçus, bordereaux et cartes clients. */
  documentColor: string;
}

export const ContributionPlanStatus = { Active: 'Active', Inactive: 'Inactive' } as const;
export type ContributionPlanStatus = (typeof ContributionPlanStatus)[keyof typeof ContributionPlanStatus];

export interface ContributionPlan {
  id: string;
  floorAmount: number;
  /** Ex. « Journalier », « Tous les 2 jours », « Hebdomadaire ». */
  frequencyLabel: string;
  /** Un plan utilisé ne peut pas être supprimé, seulement désactivé pour les nouveaux clients. */
  clientsCount: number;
  isDefault: boolean;
  status: ContributionPlanStatus;
}

export const CapBehavior = { Recommend: 'Recommend', Block: 'Block' } as const;
export type CapBehavior = (typeof CapBehavior)[keyof typeof CapBehavior];

export interface CollectionRules {
  holdingCap: number;
  capBehavior: CapBehavior;
  autoValidationDelayHours: number;
  disputeWindowHours: number;
  gapTolerance: number;
  /** Ex. « 19:00 » — heure limite de clôture de la journée. */
  settlementDeadline: string;
}

export const CustodyFeeMode = { OnePerCycle: 'OnePerCycle', Percentage: 'Percentage', None: 'None' } as const;
export type CustodyFeeMode = (typeof CustodyFeeMode)[keyof typeof CustodyFeeMode];

export interface CustodyFees {
  mode: CustodyFeeMode;
  /** Requis quand mode === OnePerCycle. */
  cycleDays?: number;
  /** Requis quand mode === Percentage. */
  percentage?: number;
}

export const ValidatorKind = { Holder: 'Holder', Substitute: 'Substitute', Admin: 'Admin' } as const;
export type ValidatorKind = (typeof ValidatorKind)[keyof typeof ValidatorKind];

export interface Validator {
  id: string;
  name: string;
  initials: string;
  /** Ex. « Responsable », « Administrateur ». */
  roleLabel: string;
  kind: ValidatorKind;
}

export interface ValidationChainEntry {
  agencyId: string;
  agencyName: string;
  /** Ordonnés — un reversement remonte la chaîne jusqu'à validation. */
  validators: Validator[];
}

export interface BankSettings {
  identity: InstitutionIdentity;
  contributionPlans: ContributionPlan[];
  collectionRules: CollectionRules;
  custodyFees: CustodyFees;
  validationChains: ValidationChainEntry[];
}
