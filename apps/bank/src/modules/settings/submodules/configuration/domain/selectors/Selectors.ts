import { createSelector } from '@reduxjs/toolkit';
import { ChangeLogAdapter, type ChangeLogEntry } from '@miya/kernel';
import type { BankRootState } from '@/config/stores/store';
import { ContributionPlanStatus, type BankSettings, type ValidationChainEntry } from '../entities/BankSettings';

const changeLogAdapterSelectors = ChangeLogAdapter.getSelectors((state: BankRootState) => state.settings.changeLog);

export const selectSettings = (state: BankRootState): BankSettings | null => state.settings.settings;

export const selectIdentity = (state: BankRootState) => selectSettings(state)?.identity;

export const selectContributionPlans = createSelector(
  [selectSettings],
  (settings) => settings?.contributionPlans ?? [],
);

export const selectActiveContributionPlans = createSelector([selectContributionPlans], (plans) =>
  plans.filter((plan) => plan.status === ContributionPlanStatus.Active),
);

export const selectCollectionRules = (state: BankRootState) => selectSettings(state)?.collectionRules;

export const selectCustodyFees = (state: BankRootState) => selectSettings(state)?.custodyFees;

export const selectValidationChains = createSelector(
  [selectSettings],
  (settings) => settings?.validationChains ?? [],
);

export const selectValidationChainByAgency = (
  state: BankRootState,
  agencyId: string,
): ValidationChainEntry | undefined => selectValidationChains(state).find((chain) => chain.agencyId === agencyId);

export const selectChangeLog = createSelector([changeLogAdapterSelectors.selectAll], (entries) => entries);

export const selectChangeLogBySection = createSelector(
  [selectChangeLog, (_state: BankRootState, section?: string) => section],
  (entries, section): ChangeLogEntry[] => (section ? entries.filter((entry) => entry.section === section) : entries),
);

/** Consommée par la carte « Configuration » du hub Administration (méta « dernière modif. »). */
export const selectLatestChangeLogEntry = createSelector(
  [selectChangeLog],
  (entries): ChangeLogEntry | undefined => entries[0],
);

export const SettingsSelectors = {
  selectSettings,
  selectIdentity,
  selectContributionPlans,
  selectActiveContributionPlans,
  selectCollectionRules,
  selectCustodyFees,
  selectValidationChains,
  selectValidationChainByAgency,
  selectChangeLog,
  selectChangeLogBySection,
  selectLatestChangeLogEntry,
};
