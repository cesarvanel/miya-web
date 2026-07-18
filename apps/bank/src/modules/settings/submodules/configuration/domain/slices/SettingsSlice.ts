import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { ChangeLogAdapter, type ChangeLogEntry } from '@miya/kernel';
import {
  ContributionPlanStatus,
  type BankSettings,
  type CollectionRules,
  type ContributionPlan,
  type CustodyFees,
  type InstitutionIdentity,
  type Validator,
} from '../entities/BankSettings';
import { FetchChangeLogAsync } from '../../application/usecases/fetch-change-log-async/FetchChangeLogAsync';
import { FetchSettingsAsync } from '../../application/usecases/fetch-settings-async/FetchSettingsAsync';

const initialState = {
  settings: null as BankSettings | null,
  changeLog: ChangeLogAdapter.getInitialState(),
};

export type SettingsState = typeof initialState;

let nextEntrySeq = 1;
const nextEntryId = (): string => `chg-local-${Date.now()}-${nextEntrySeq++}`;

const pushEntry = (
  state: SettingsState,
  entry: Omit<ChangeLogEntry, 'id'>,
): void => {
  ChangeLogAdapter.addOne(state.changeLog, { ...entry, id: nextEntryId() });
};

const fcfa = (amount: number): string => `${amount.toLocaleString('fr-FR')} FCFA`;
const capBehaviorLabel = (behavior: string): string => (behavior === 'Block' ? 'Blocage' : 'Recommandation');
const deadlineLabel = (hhmm: string): string => `avant ${hhmm.replace(':', 'h')}`;

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    /** Identité — un changelog par champ réellement modifié. */
    identityUpdated: (
      state,
      action: PayloadAction<{ by: string; at: string; changes: Partial<InstitutionIdentity> }>,
    ) => {
      if (!state.settings) {
        return;
      }
      const { by, at, changes } = action.payload;
      const identity = state.settings.identity;
      const logoOrColorChanged = changes.logoUrl !== undefined || changes.documentColor !== undefined;
      if (logoOrColorChanged) {
        pushEntry(state, {
          at,
          by,
          section: 'Identité',
          field: 'Logo & couleur documentaire',
          oldValue: identity.documentColor,
          newValue: changes.documentColor ?? identity.documentColor,
        });
      }
      const textFieldChanges: Array<[keyof InstitutionIdentity, string]> = [
        ['name', 'Raison sociale'],
        ['city', 'Siège'],
      ];
      for (const [key, label] of textFieldChanges) {
        const incoming = changes[key];
        if (typeof incoming === 'string' && incoming !== identity[key]) {
          pushEntry(state, { at, by, section: 'Identité', field: label, oldValue: String(identity[key]), newValue: incoming });
        }
      }
      if (changes.contacts && (changes.contacts.phone !== identity.contacts.phone || changes.contacts.email !== identity.contacts.email)) {
        pushEntry(state, {
          at,
          by,
          section: 'Identité',
          field: 'Coordonnées',
          oldValue: `${identity.contacts.phone} · ${identity.contacts.email}`,
          newValue: `${changes.contacts.phone} · ${changes.contacts.email}`,
        });
      }
      state.settings.identity = { ...identity, ...changes };
    },

    planUpserted: (state, action: PayloadAction<{ by: string; at: string; plan: ContributionPlan }>) => {
      if (!state.settings) {
        return;
      }
      const { by, at, plan } = action.payload;
      const existing = state.settings.contributionPlans.find((candidate) => candidate.id === plan.id);
      if (existing) {
        state.settings.contributionPlans = state.settings.contributionPlans.map((candidate) =>
          candidate.id === plan.id ? plan : candidate,
        );
        pushEntry(state, {
          at,
          by,
          section: 'Plans',
          field: 'Plan de cotisation modifié',
          oldValue: `${fcfa(existing.floorAmount)} / ${existing.frequencyLabel}`,
          newValue: `${fcfa(plan.floorAmount)} / ${plan.frequencyLabel}`,
        });
      } else {
        state.settings.contributionPlans = [...state.settings.contributionPlans, plan];
        pushEntry(state, {
          at,
          by,
          section: 'Plans',
          field: 'Plan de cotisation créé',
          oldValue: '—',
          newValue: `${fcfa(plan.floorAmount)} / ${plan.frequencyLabel}`,
        });
      }
    },

    planDeactivated: (state, action: PayloadAction<{ by: string; at: string; planId: string }>) => {
      if (!state.settings) {
        return;
      }
      const { by, at, planId } = action.payload;
      const plan = state.settings.contributionPlans.find((candidate) => candidate.id === planId);
      if (!plan || plan.status === ContributionPlanStatus.Inactive) {
        return;
      }
      state.settings.contributionPlans = state.settings.contributionPlans.map((candidate) =>
        candidate.id === planId ? { ...candidate, status: ContributionPlanStatus.Inactive } : candidate,
      );
      pushEntry(state, {
        at,
        by,
        section: 'Plans',
        field: 'Plan de cotisation désactivé',
        oldValue: `${fcfa(plan.floorAmount)} / ${plan.frequencyLabel}`,
        newValue: 'Désactivé pour les nouveaux',
      });
    },

    collectionRulesUpdated: (
      state,
      action: PayloadAction<{ by: string; at: string; changes: Partial<CollectionRules> }>,
    ) => {
      if (!state.settings) {
        return;
      }
      const { by, at, changes } = action.payload;
      const rules = state.settings.collectionRules;

      if (changes.holdingCap !== undefined && changes.holdingCap !== rules.holdingCap) {
        pushEntry(state, {
          at,
          by,
          section: 'Règles de collecte',
          field: 'Plafond de détention par agent',
          oldValue: fcfa(rules.holdingCap),
          newValue: fcfa(changes.holdingCap),
        });
      }
      if (changes.capBehavior !== undefined && changes.capBehavior !== rules.capBehavior) {
        pushEntry(state, {
          at,
          by,
          section: 'Règles de collecte',
          field: 'Comportement au seuil',
          oldValue: capBehaviorLabel(rules.capBehavior),
          newValue: capBehaviorLabel(changes.capBehavior),
        });
      }
      if (changes.settlementDeadline !== undefined && changes.settlementDeadline !== rules.settlementDeadline) {
        pushEntry(state, {
          at,
          by,
          section: 'Règles de collecte',
          field: 'Fenêtre de reversement',
          oldValue: deadlineLabel(rules.settlementDeadline),
          newValue: deadlineLabel(changes.settlementDeadline),
        });
      }
      if (changes.autoValidationDelayHours !== undefined && changes.autoValidationDelayHours !== rules.autoValidationDelayHours) {
        pushEntry(state, {
          at,
          by,
          section: 'Règles de collecte',
          field: "Délai d'auto-validation",
          oldValue: `${rules.autoValidationDelayHours} h`,
          newValue: `${changes.autoValidationDelayHours} h`,
        });
      }
      if (changes.disputeWindowHours !== undefined && changes.disputeWindowHours !== rules.disputeWindowHours) {
        pushEntry(state, {
          at,
          by,
          section: 'Règles de collecte',
          field: 'Fenêtre de contestation',
          oldValue: `${rules.disputeWindowHours} h`,
          newValue: `${changes.disputeWindowHours} h`,
        });
      }
      if (changes.gapTolerance !== undefined && changes.gapTolerance !== rules.gapTolerance) {
        pushEntry(state, {
          at,
          by,
          section: 'Règles de collecte',
          field: "Tolérance d'écart",
          oldValue: fcfa(rules.gapTolerance),
          newValue: fcfa(changes.gapTolerance),
        });
      }

      state.settings.collectionRules = { ...rules, ...changes };
    },

    custodyFeesUpdated: (state, action: PayloadAction<{ by: string; at: string; custodyFees: CustodyFees }>) => {
      if (!state.settings) {
        return;
      }
      const { by, at, custodyFees } = action.payload;
      const current = state.settings.custodyFees;
      const format = (fees: CustodyFees): string => {
        if (fees.mode === 'OnePerCycle') {
          return `1 cotisation / ${fees.cycleDays ?? '—'} j`;
        }
        if (fees.mode === 'Percentage') {
          return `${fees.percentage ?? 0}% du collecté`;
        }
        return 'Aucun frais';
      };
      state.settings.custodyFees = custodyFees;
      pushEntry(state, {
        at,
        by,
        section: 'Frais de garde',
        field: 'Mode de calcul',
        oldValue: format(current),
        newValue: format(custodyFees),
      });
    },

    /** Réordonnancement structurel — le libellé du changement est fourni par l'appelant (application layer). */
    validationChainUpdated: (
      state,
      action: PayloadAction<{ by: string; at: string; agencyId: string; agencyName: string; validators: Validator[]; description: string }>,
    ) => {
      if (!state.settings) {
        return;
      }
      const { by, at, agencyId, agencyName, validators, description } = action.payload;
      const existing = state.settings.validationChains.find((chain) => chain.agencyId === agencyId);
      if (existing) {
        state.settings.validationChains = state.settings.validationChains.map((chain) =>
          chain.agencyId === agencyId ? { ...chain, validators } : chain,
        );
      } else {
        state.settings.validationChains = [...state.settings.validationChains, { agencyId, agencyName, validators }];
      }
      pushEntry(state, {
        at,
        by,
        section: 'Validation',
        field: `Chaîne de validation — ${agencyName}`,
        oldValue: '—',
        newValue: description,
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(FetchSettingsAsync.fulfilled, (state, action) => {
        state.settings = action.payload.settings;
      })
      .addCase(FetchChangeLogAsync.fulfilled, (state, action) => {
        ChangeLogAdapter.upsertMany(state.changeLog, action.payload.entries);
      });
  },
});

export const SettingsActions = settingsSlice.actions;
