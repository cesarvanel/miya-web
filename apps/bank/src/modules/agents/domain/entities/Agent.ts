import { createEntityAdapter } from '@reduxjs/toolkit';

export const AgentRole = { Collector: 'Collector', Supervisor: 'Supervisor' } as const;
export type AgentRole = (typeof AgentRole)[keyof typeof AgentRole];

export const AgentStatus = {
  Active: 'Active',
  PendingActivation: 'PendingActivation',
  Suspended: 'Suspended',
} as const;
export type AgentStatus = (typeof AgentStatus)[keyof typeof AgentStatus];

export interface AgentSupervisor {
  id: string;
  name: string;
}

export interface AgentDevice {
  /** Ex. « Tecno Spark 20 ». */
  model: string;
  /** Ex. « Android 14 ». */
  os: string;
  /** Ex. « ••• 7842 » — jamais l'IMEI complet côté vue. */
  maskedImei: string;
  /** Format maquette (« 12 fév. 2024 »). */
  linkedAt: string;
}

export interface AgentMonthStats {
  collected: number;
  /** Pourcentage (ex. 98.4). */
  confirmationRate: number;
  gaps: number;
}

export interface Agent {
  id: string;
  fullName: string;
  /** Ex. « AGT-04127 » (agents) ou « RSP-04001 » (responsables). */
  registrationNumber: string;
  role: AgentRole;
  /** Uniquement pour les collecteurs — null pour un responsable. */
  supervisor: AgentSupervisor | null;
  agency: string;
  zones: string[];
  status: AgentStatus;
  /** null si aucun appareil lié — l'agent ne peut alors pas collecter. */
  device: AgentDevice | null;
  monthStats: AgentMonthStats;
  /** Horodatage du dernier code d'activation généré — le code lui-même ne transite jamais par Redux (affiché uniquement dans la modale). */
  lastActivationCodeGeneratedAt: string | null;
}

export const AgentsAdapter = createEntityAdapter<Agent, string>({
  selectId: (agent) => agent.id,
});
