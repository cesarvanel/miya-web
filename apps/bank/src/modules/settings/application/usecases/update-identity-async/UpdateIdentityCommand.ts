import type { InstitutionIdentity } from '../../../domain/entities/BankSettings';

/** La devise n'est jamais incluse — non modifiable. */
export type UpdateIdentityCommand = Partial<Omit<InstitutionIdentity, 'currency'>>;
