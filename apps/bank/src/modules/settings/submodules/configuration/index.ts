import { SettingsSelectors } from './domain/selectors/Selectors';
import { settingsSlice } from './domain/slices/SettingsSlice';

// Types de domaine
export { CapBehavior, ContributionPlanStatus, CustodyFeeMode, ValidatorKind } from './domain/entities/BankSettings';
export type {
  BankSettings,
  CollectionRules,
  ContributionPlan,
  CustodyFees,
  InstitutionContacts,
  InstitutionIdentity,
  ValidationChainEntry,
  Validator,
} from './domain/entities/BankSettings';
export { ChangeLogAdapter } from './domain/entities/ChangeLogEntry';
export type { ChangeLogEntry } from './domain/entities/ChangeLogEntry';

// Reducer (branché dans RootReducer)
export const settingsReducer = settingsSlice.reducer;

// Selectors — groupés, comme prescrit par CLAUDE.md
export const settingsSelectors = {
  ...SettingsSelectors,
};

// Use cases
export { FetchSettingsAsync } from './application/usecases/fetch-settings-async/FetchSettingsAsync';
export type { FetchSettingsCommand } from './application/usecases/fetch-settings-async/FetchSettingsCommand';
export type { FetchSettingsResponse } from './application/usecases/fetch-settings-async/FetchSettingsResponse';

export { FetchChangeLogAsync } from './application/usecases/fetch-change-log-async/FetchChangeLogAsync';
export type { FetchChangeLogCommand } from './application/usecases/fetch-change-log-async/FetchChangeLogCommand';
export type { FetchChangeLogResponse } from './application/usecases/fetch-change-log-async/FetchChangeLogResponse';

export { UpdateIdentityAsync } from './application/usecases/update-identity-async/UpdateIdentityAsync';
export type { UpdateIdentityCommand } from './application/usecases/update-identity-async/UpdateIdentityCommand';

export { UpsertPlanAsync } from './application/usecases/upsert-plan-async/UpsertPlanAsync';
export type { UpsertPlanCommand } from './application/usecases/upsert-plan-async/UpsertPlanCommand';
export type { UpsertPlanResponse } from './application/usecases/upsert-plan-async/UpsertPlanResponse';

export { DeactivatePlanAsync } from './application/usecases/deactivate-plan-async/DeactivatePlanAsync';
export type { DeactivatePlanCommand } from './application/usecases/deactivate-plan-async/DeactivatePlanCommand';

export { UpdateHoldingCapAsync } from './application/usecases/update-holding-cap-async/UpdateHoldingCapAsync';
export type { UpdateHoldingCapCommand } from './application/usecases/update-holding-cap-async/UpdateHoldingCapCommand';

export { UpdateSettlementDeadlineAsync } from './application/usecases/update-settlement-deadline-async/UpdateSettlementDeadlineAsync';
export type { UpdateSettlementDeadlineCommand } from './application/usecases/update-settlement-deadline-async/UpdateSettlementDeadlineCommand';

export { UpdateCollectionRulesAsync } from './application/usecases/update-collection-rules-async/UpdateCollectionRulesAsync';
export type { UpdateCollectionRulesCommand } from './application/usecases/update-collection-rules-async/UpdateCollectionRulesCommand';

export { UpdateCustodyFeesAsync } from './application/usecases/update-custody-fees-async/UpdateCustodyFeesAsync';
export type { UpdateCustodyFeesCommand } from './application/usecases/update-custody-fees-async/UpdateCustodyFeesCommand';

export { UpdateValidationChainAsync } from './application/usecases/update-validation-chain-async/UpdateValidationChainAsync';
export type { UpdateValidationChainCommand } from './application/usecases/update-validation-chain-async/UpdateValidationChainCommand';

// Ports (types utilisés par la composition root)
export type { SettingsDependencies } from './application/ports/SettingsDependencies';
export type { SettingsGateway, UpsertPlanInput } from './application/ports/SettingsGateway';

// Infrastructure (instanciée par la composition root)
export { FakeSettingsGateway } from './infrastructure/gateways/FakeSettingsGateway';
export { SettingsRouter } from './infrastructure/router/SettingsRouter';
export { SettingsRoutes } from './infrastructure/router/SettingsRoutes';
export { GetSettingsLoader } from './infrastructure/views/loaders/SettingsLoaders';
