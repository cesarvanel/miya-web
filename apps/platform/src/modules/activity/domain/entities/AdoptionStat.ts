import { createEntityAdapter } from '@reduxjs/toolkit';

export const AdoptionTrend = { Up: 'Up', Flat: 'Flat', Down: 'Down' } as const;
export type AdoptionTrend = (typeof AdoptionTrend)[keyof typeof AdoptionTrend];

/** Adoption d'une banque — agents créés vs actifs sur 30 jours, un enregistrement par tenant. */
export interface AdoptionStat {
  tenantId: string;
  tenantName: string;
  agentsCreated: number;
  agentsActive30d: number;
  /** Dérivé : agentsActive30d / agentsCreated. */
  adoptionRate: number;
  trend: AdoptionTrend;
}

export const computeAdoptionRate = (agentsActive30d: number, agentsCreated: number): number =>
  agentsCreated > 0 ? agentsActive30d / agentsCreated : 0;

export const adoptionAdapter = createEntityAdapter<AdoptionStat, string>({
  selectId: (stat) => stat.tenantId,
  sortComparer: (a, b) => a.adoptionRate - b.adoptionRate,
});
