import { createEntityAdapter } from '@reduxjs/toolkit';

export const RoundStopStatus = {
  ToVisit: 'ToVisit',
  Collected: 'Collected',
  Pending: 'Pending',
  Absent: 'Absent',
  Postponed: 'Postponed',
  OffRound: 'OffRound',
} as const;
export type RoundStopStatus = (typeof RoundStopStatus)[keyof typeof RoundStopStatus];

export interface RoundStopClient {
  id: string;
  name: string;
  activity: string;
  hasSmartphone: boolean;
}

export interface RoundStop {
  id: string;
  roundId: string;
  /** Zone du stop — un ajout au-delà du champ littéral demandé : nécessaire
   * pour le regroupement par zone (une tournée peut couvrir 2 zones voisines,
   * ex. Cédric N. : Marché Mokolo + Carrefour Warda). */
  zone: string;
  client: RoundStopClient;
  /** Montant habituellement cotisé par ce client, en FCFA. */
  usualAmount: number;
  status: RoundStopStatus;
  collectedAmount?: number;
  /** Format maquette (« 08h26 »). */
  collectedAt?: string;
  note?: string;
}

export const StopsAdapter = createEntityAdapter<RoundStop, string>({
  selectId: (stop) => stop.id,
});
