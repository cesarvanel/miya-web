import { createEntityAdapter } from '@reduxjs/toolkit';

/**
 * Journal des changements générique — chaque mutation d'un module de
 * paramètres (bank/settings, platform/settings-platform…) « prépend » une
 * entrée immuable. Extrait dans le kernel car dupliqué à l'identique entre
 * les deux apps (même pattern que `createAuthGuards`).
 */
export interface ChangeLogEntry {
  id: string;
  /** ISO. */
  at: string;
  by: string;
  /** Ex. « Identité », « Comptes super admin », « Notifications ». */
  section: string;
  /** Libellé du champ modifié, ex. « Plafond de détention par agent ». */
  field: string;
  /** Formatée pour affichage — ex. « 100 000 FCFA ». */
  oldValue: string;
  newValue: string;
}

/** Plus récent d'abord — le journal se « prépend » à l'affichage via ce tri, jamais modifié en place (audit). */
export const ChangeLogAdapter = createEntityAdapter<ChangeLogEntry, string>({
  selectId: (entry) => entry.id,
  sortComparer: (a, b) => b.at.localeCompare(a.at),
});
