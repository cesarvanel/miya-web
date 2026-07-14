import type { BankSettings } from '../../../domain/entities/BankSettings';

export interface FetchSettingsResponse {
  settings: BankSettings;
}
