import { createEntityAdapter } from '@reduxjs/toolkit';

export const ClientStatus = { Active: 'Active', Inactive: 'Inactive' } as const;
export type ClientStatus = (typeof ClientStatus)[keyof typeof ClientStatus];

export const ClientPlanFrequency = {
  Daily: 'Daily',
  EveryTwoDays: 'EveryTwoDays',
  Weekly: 'Weekly',
} as const;
export type ClientPlanFrequency = (typeof ClientPlanFrequency)[keyof typeof ClientPlanFrequency];

export interface ClientAssignedAgent {
  id: string;
  name: string;
}

export interface ClientIdDocument {
  type: 'CNI';
  /** Ex. « CNI ••• 4471 » — jamais le numéro complet côté client. */
  maskedNumber: string;
}

export interface ClientPlan {
  frequency: ClientPlanFrequency;
  /** Plancher du plan, en FCFA — usualAmount doit toujours être ≥ floorAmount. */
  floorAmount: number;
}

export interface ClientRegularity {
  contributed: number;
  expected: number;
}

export interface PendingWithdrawal {
  amount: number;
  /** Format maquette (« hier », « 14h52 ») — cohérent avec les autres modules. */
  requestedAt: string;
}

export interface Client {
  id: string;
  fullName: string;
  /** Ex. « Vendeuse de beignets ». */
  activity: string;
  zone: string;
  assignedAgent: ClientAssignedAgent;
  /** 9 chiffres camerounais, sans mise en forme — formaté via PhoneNumber du kernel dans les vues. */
  phone: string;
  idDocument: ClientIdDocument;
  hasSmartphone: boolean;
  /** ISO (YYYY-MM-DD) — mois/année affichés dans les vues. */
  clientSince: string;
  status: ClientStatus;
  plan: ClientPlan;
  /** Montant choisi par la cliente, ≥ plan.floorAmount. */
  usualAmount: number;
  savingsBalance: number;
  regularity: ClientRegularity;
  pendingWithdrawal: PendingWithdrawal | null;
}

export const ClientsAdapter = createEntityAdapter<Client, string>({
  selectId: (client) => client.id,
});
