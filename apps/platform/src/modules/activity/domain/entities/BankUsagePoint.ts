/**
 * RÈGLE DE CONFIDENTIALITÉ — module activity : uniquement des AGRÉGATS
 * (volumes, compteurs, taux). JAMAIS de données métier internes des banques :
 * aucun nom de client final, aucun détail de transaction, aucun nom d'agent.
 * Toute entité/fixture ajoutée ici doit respecter cette règle strictement.
 */
import { createEntityAdapter } from '@reduxjs/toolkit';

/** Point d'usage journalier d'une banque — des COMPTEURS, jamais des contenus. */
export interface BankUsagePoint {
  tenantId: string;
  /** ISO date (YYYY-MM-DD). */
  date: string;
  activeAgents: number;
  syncCount: number;
  collectionsCount: number;
}

export const usageAdapter = createEntityAdapter<BankUsagePoint, string>({
  selectId: (point) => `${point.tenantId}:${point.date}`,
  sortComparer: (a, b) => a.date.localeCompare(b.date),
});
