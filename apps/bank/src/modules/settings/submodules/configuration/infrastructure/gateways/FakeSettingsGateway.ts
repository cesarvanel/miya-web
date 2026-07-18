import type { ChangeLogEntry } from '@miya/kernel';
import type { SettingsGateway, UpsertPlanInput } from '../../application/ports/SettingsGateway';
import {
  CapBehavior,
  ContributionPlanStatus,
  CustodyFeeMode,
  ValidatorKind,
  type BankSettings,
  type CollectionRules,
  type ContributionPlan,
  type CustodyFees,
  type InstitutionIdentity,
  type Validator,
} from '../../domain/entities/BankSettings';

const daysAgo = (days: number, hour = 9, minute = 0): string => {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - days);
  date.setUTCHours(hour, minute, 0, 0);
  return date.toISOString();
};

const seedIdentity = (): InstitutionIdentity => ({
  name: 'MEC La Confiance',
  city: 'Yaoundé, Cameroun',
  currency: 'FCFA (XAF)',
  contacts: { phone: '690227133', email: 'contact@laconfiance.cm' },
  logoUrl: undefined,
  documentColor: '#0A6B4E',
});

/** 500/1 000 (le plus courant)/2 000/5 000 FCFA/jour + un plan bihebdomadaire utilisé par 142 clients (démo du garde-fou de désactivation). */
const seedPlans = (): ContributionPlan[] => [
  { id: 'plan-500', floorAmount: 500, frequencyLabel: 'Journalier', clientsCount: 218, isDefault: false, status: ContributionPlanStatus.Active },
  { id: 'plan-1000', floorAmount: 1_000, frequencyLabel: 'Journalier', clientsCount: 642, isDefault: true, status: ContributionPlanStatus.Active },
  { id: 'plan-2000', floorAmount: 2_000, frequencyLabel: 'Journalier', clientsCount: 281, isDefault: false, status: ContributionPlanStatus.Active },
  { id: 'plan-5000', floorAmount: 5_000, frequencyLabel: 'Journalier', clientsCount: 96, isDefault: false, status: ContributionPlanStatus.Active },
  { id: 'plan-2500-biweekly', floorAmount: 2_500, frequencyLabel: 'Tous les 2 jours', clientsCount: 142, isDefault: false, status: ContributionPlanStatus.Active },
];

const seedCollectionRules = (): CollectionRules => ({
  holdingCap: 100_000,
  capBehavior: CapBehavior.Recommend,
  autoValidationDelayHours: 24,
  disputeWindowHours: 48,
  gapTolerance: 500,
  settlementDeadline: '19:00',
});

const seedCustodyFees = (): CustodyFees => ({
  mode: CustodyFeeMode.OnePerCycle,
  cycleDays: 31,
});

const mbarga: Validator = { id: 'v-antoine-mbarga', name: 'Antoine Mbarga', initials: 'AM', roleLabel: 'Responsable', kind: ValidatorKind.Holder };
const ngono: Validator = { id: 'v-clarisse-ngono', name: 'Clarisse Ngono', initials: 'CN', roleLabel: 'Responsable', kind: ValidatorKind.Substitute };
const ndione: Validator = { id: 'v-diane-ndione', name: 'Diane Ndione', initials: 'DN', roleLabel: 'Administrateur', kind: ValidatorKind.Admin };
const owona: Validator = { id: 'v-pauline-owona', name: 'Pauline Owona', initials: 'PO', roleLabel: 'Responsable', kind: ValidatorKind.Holder };

const seedValidationChains = () => [
  { agencyId: 'agency-mokolo', agencyName: 'Mokolo', validators: [mbarga, ngono, ndione] },
  { agencyId: 'agency-essos', agencyName: 'Essos', validators: [owona, ndione] },
];

/** Journal — la modif du 28 juin par D. Ndione (exigée), plus 2 entrées cohérentes avec l'état courant seedé. */
const seedChangeLog = (): ChangeLogEntry[] => [
  {
    id: 'chg-0628-logo',
    at: daysAgo(16, 9, 12),
    by: 'D. Ndione',
    section: 'Identité',
    field: 'Logo & couleur documentaire',
    oldValue: '—',
    newValue: 'Nouveau logo importé · couleur #0A6B4E',
  },
  {
    id: 'chg-0629-dispute-window',
    at: daysAgo(15, 16, 5),
    by: 'D. Ndione',
    section: 'Règles de collecte',
    field: 'Fenêtre de contestation',
    oldValue: '24 h',
    newValue: '48 h',
  },
  {
    id: 'chg-0630-validation-chain',
    at: daysAgo(14, 10, 30),
    by: 'D. Ndione',
    section: 'Validation',
    field: 'Chaîne de validation — Mokolo',
    oldValue: '—',
    newValue: 'Suppléant ajouté : Clarisse Ngono en position 2',
  },
];

const delay = (): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 300));

/** Gateway en mémoire — pas de backend. Latence simulée (300-600ms). */
export class FakeSettingsGateway implements SettingsGateway {
  private settings: BankSettings = {
    identity: seedIdentity(),
    contributionPlans: seedPlans(),
    collectionRules: seedCollectionRules(),
    custodyFees: seedCustodyFees(),
    validationChains: seedValidationChains(),
  };
  private changeLog: ChangeLogEntry[] = seedChangeLog();
  private nextPlanSeq = 6;

  async fetch(): Promise<{ settings: BankSettings }> {
    await delay();
    return { settings: structuredClone(this.settings) };
  }

  async updateIdentity(changes: Partial<InstitutionIdentity>): Promise<void> {
    await delay();
    this.settings.identity = { ...this.settings.identity, ...changes };
  }

  async upsertPlan(input: UpsertPlanInput): Promise<{ plan: ContributionPlan }> {
    await delay();
    if (input.id) {
      const existing = this.settings.contributionPlans.find((plan) => plan.id === input.id);
      if (!existing) {
        throw new Error(`Plan introuvable : ${input.id}`);
      }
      const updated: ContributionPlan = { ...existing, floorAmount: input.floorAmount, frequencyLabel: input.frequencyLabel };
      this.settings.contributionPlans = this.settings.contributionPlans.map((plan) => (plan.id === input.id ? updated : plan));
      return { plan: structuredClone(updated) };
    }
    const plan: ContributionPlan = {
      id: `plan-custom-${this.nextPlanSeq++}`,
      floorAmount: input.floorAmount,
      frequencyLabel: input.frequencyLabel,
      clientsCount: 0,
      isDefault: false,
      status: ContributionPlanStatus.Active,
    };
    this.settings.contributionPlans = [...this.settings.contributionPlans, plan];
    return { plan: structuredClone(plan) };
  }

  async deactivatePlan(planId: string): Promise<void> {
    await delay();
    const plan = this.settings.contributionPlans.find((candidate) => candidate.id === planId);
    if (!plan) {
      throw new Error(`Plan introuvable : ${planId}`);
    }
    plan.status = ContributionPlanStatus.Inactive;
  }

  async updateCollectionRules(changes: Partial<CollectionRules>): Promise<void> {
    await delay();
    this.settings.collectionRules = { ...this.settings.collectionRules, ...changes };
  }

  async updateCustodyFees(custodyFees: CustodyFees): Promise<void> {
    await delay();
    this.settings.custodyFees = custodyFees;
  }

  async updateValidationChain(agencyId: string, validators: Validator[]): Promise<void> {
    await delay();
    const existing = this.settings.validationChains.find((chain) => chain.agencyId === agencyId);
    if (existing) {
      existing.validators = validators;
    }
  }

  async fetchChangeLog(): Promise<{ entries: ChangeLogEntry[] }> {
    await delay();
    return { entries: this.changeLog.map((entry) => structuredClone(entry)) };
  }
}
