import { createEntityAdapter } from '@reduxjs/toolkit';

export interface CollectionZone {
  id: string;
  agencyId: string;
  name: string;
  sector: string;
  /** Null si non affectée — l'agent réel vient du module agents (id partagé). */
  assignedAgentId: string | null;
  assignedAgentName: string | null;
  clientsCount: number;
  /** Pourcentage 0-100, null tant qu'aucun agent n'est affecté (« — » dans les vues). */
  regularityRate: number | null;
}

export const ZonesAdapter = createEntityAdapter<CollectionZone, string>({
  selectId: (zone) => zone.id,
});
