import { createEntityAdapter } from '@reduxjs/toolkit';

export type PlanName = 'Essentiel' | 'Croissance' | 'Élite';

/** `null` = illimité (palier Élite) — seules les agences sont toujours plafonnées. */
export interface PlanLimits {
  agents: number | null;
  clients: number | null;
  agencies: number;
}

export const PlanStatus = { Active: 'Active', Archived: 'Archived' } as const;
export type PlanStatus = (typeof PlanStatus)[keyof typeof PlanStatus];

export interface Plan {
  id: string;
  name: PlanName;
  monthlyPrice: number;
  limits: PlanLimits;
  /** Nombre de banques actuellement sur ce plan — source du MRR et du garde-fou d'archivage. */
  tenantsCount: number;
  status: PlanStatus;
}

export const plansAdapter = createEntityAdapter<Plan>();
