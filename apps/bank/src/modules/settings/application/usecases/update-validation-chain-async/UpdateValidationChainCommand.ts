import type { Validator } from '../../../domain/entities/BankSettings';

export interface UpdateValidationChainCommand {
  agencyId: string;
  agencyName: string;
  validators: Validator[];
}
