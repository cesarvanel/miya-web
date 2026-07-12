import type { ClientPlanFrequency } from '../../../domain/entities/Client';

export interface CreateClientIdentity {
  fullName: string;
  /** 9 chiffres camerounais, sans mise en forme — validé via PhoneNumber du kernel. */
  phone: string;
  /** Numéro complet saisi — le gateway le masque avant stockage. */
  cniNumber: string;
  activity: string;
}

export interface CreateClientPlan {
  frequency: ClientPlanFrequency;
  floorAmount: number;
}

export interface CreateClientAssignment {
  zone: string;
  agentId: string;
  agentName: string;
}

export interface CreateClientCommand {
  identity: CreateClientIdentity;
  plan: CreateClientPlan;
  usualAmount: number;
  assignment: CreateClientAssignment;
  hasSmartphone: boolean;
}
