/**
 * Chiffres du jour partagés par les fakes gateways de `dashboard` et de
 * `collections` — une seule source pour que « la tournée de Cédric 34/52 »
 * raconte exactement la même histoire des deux côtés. Ni l'un ni l'autre
 * module n'importe les entrailles de l'autre : les deux lisent ce fichier
 * neutre, posé à côté de `dependencies.ts` (composition root), plutôt que
 * l'un exportant ses fixtures internes via son index public.
 *
 * Pure donnée démo (pas de logique) — n'appartient pas à libs/kernel
 * (« outillage SANS métier »).
 */
export interface AgentRosterEntry {
  agentId: string;
  name: string;
  /** Matricule agent affiché dans les maquettes (ex. « AGT-04127 »). */
  code: string;
  zone: string;
  roundProgress: { visited: number; total: number };
  collectedAmount: number;
  cashInHand: number;
  cashHoldingCap: number;
  /** Heure de départ de tournée, format maquette (« 07h12 »). */
  startedAt: string;
  /** Heure de fin, uniquement pour les tournées déjà clôturées. */
  endedAt: string | null;
}

export const AGENTS_ROSTER: AgentRosterEntry[] = [
  {
    agentId: 'agent-cedric-nkoulou',
    name: 'Cédric Nkoulou',
    code: 'AGT-04127',
    zone: 'Marché Mokolo',
    roundProgress: { visited: 34, total: 52 },
    collectedAmount: 34_200,
    cashInHand: 85_000,
    cashHoldingCap: 100_000,
    startedAt: '07h12',
    endedAt: null,
  },
  {
    agentId: 'agent-grace-atangana',
    name: 'Grace Atangana',
    code: 'AGT-04102',
    zone: 'Carrefour Warda',
    roundProgress: { visited: 41, total: 45 },
    collectedAmount: 39_500,
    cashInHand: 52_000,
    cashHoldingCap: 100_000,
    startedAt: '07h05',
    endedAt: null,
  },
  {
    agentId: 'agent-ibrahim-sali',
    name: 'Ibrahim Sali',
    code: 'AGT-04088',
    zone: 'Mvog-Ada',
    roundProgress: { visited: 52, total: 52 },
    collectedAmount: 44_500,
    cashInHand: 44_500,
    cashHoldingCap: 100_000,
    startedAt: '07h00',
    endedAt: '12h05',
  },
  {
    agentId: 'agent-jean-baptiste-owona',
    name: 'Jean-Baptiste Owona',
    code: 'AGT-04073',
    zone: 'Essos',
    roundProgress: { visited: 45, total: 45 },
    collectedAmount: 47_000,
    cashInHand: 0,
    cashHoldingCap: 100_000,
    startedAt: '07h08',
    endedAt: '11h40',
  },
  {
    agentId: 'agent-rosalie-fotso',
    name: 'Rosalie Fotso',
    code: 'AGT-04155',
    zone: 'Marché Mokolo',
    roundProgress: { visited: 28, total: 40 },
    collectedAmount: 21_000,
    cashInHand: 61_000,
    cashHoldingCap: 100_000,
    startedAt: '07h30',
    endedAt: null,
  },
];
