import { createEntityAdapter } from '@reduxjs/toolkit';

export interface ChangeLogEntry {
  id: string;
  /** ISO. */
  at: string;
  by: string;
  /** Ex. « Identité », « Plans », « Règles de collecte », « Frais de garde », « Validation ». */
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
