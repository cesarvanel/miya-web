import type { DayOfWeek, EngagementPreset } from '../../../domain/entities/SavingsPlan';

export interface CreateClientIdentity {
  fullName: string;
  /** 9 chiffres camerounais, sans mise en forme — validé via PhoneNumber du kernel. */
  phone: string;
  /** Numéro complet saisi — le gateway le masque avant stockage. */
  cniNumber: string;
  activity: string;
}

export interface CreateClientSavingsPlan {
  amountPerCollectionDay: number;
  /** Au moins un jour coché. */
  collectionDays: DayOfWeek[];
  startDate: string;
  endDate: string;
  preset: EngagementPreset;
  openingDeposit?: number;
}

export interface CreateClientAssignment {
  zone: string;
  agentId: string;
  agentName: string;
}

export interface CreateClientCommand {
  identity: CreateClientIdentity;
  savingsPlan: CreateClientSavingsPlan;
  assignment: CreateClientAssignment;
  hasSmartphone: boolean;
}
