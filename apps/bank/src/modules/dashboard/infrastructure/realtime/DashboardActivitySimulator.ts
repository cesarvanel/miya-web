import type { FakeRealtimeClient } from '@/config/stores/socket/realtime';
import { collectionConfirmed } from '../../domain/events/Events';

interface ScriptEntry {
  agentId: string;
  clientName: string;
  amount: number;
}

/** Uniquement des agents en tournée (OnRound) du seed — cohérent avec FakeDashboardGateway. */
const SCRIPT: ScriptEntry[] = [
  { agentId: 'agent-cedric-nkoulou', clientName: 'Solange Meka', amount: 1_000 },
  { agentId: 'agent-rosalie-fotso', clientName: 'Vincent Abega', amount: 1_500 },
  { agentId: 'agent-grace-atangana', clientName: 'Alphonsine Ndongo', amount: 1_000 },
  { agentId: 'agent-cedric-nkoulou', clientName: 'André Fouda', amount: 2_000 },
  { agentId: 'agent-rosalie-fotso', clientName: 'Clémence Onana', amount: 1_000 },
];

const MIN_DELAY_MS = 8_000;
const MAX_DELAY_MS = 15_000;

/**
 * Simule un flux d'activité (dev/démo, pas de backend) : toutes les 8–15s,
 * émet une collecte confirmée via le `RealtimeClient` — jamais de mutation
 * directe du domaine depuis l'infra, uniquement l'événement typé
 * (`domain/events`) que le slice sait déjà traiter.
 */
export const startDashboardActivitySimulation = (
  realtimeClient: FakeRealtimeClient,
): (() => void) => {
  let index = 0;
  let timer: ReturnType<typeof setTimeout>;

  const scheduleNext = (): void => {
    const delay = MIN_DELAY_MS + Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS);
    timer = setTimeout(() => {
      const entry = SCRIPT[index % SCRIPT.length] as ScriptEntry;
      index += 1;
      realtimeClient.simulate({
        type: collectionConfirmed.type,
        payload: {
          agentId: entry.agentId,
          amount: entry.amount,
          clientName: entry.clientName,
        },
      });
      scheduleNext();
    }, delay);
  };

  scheduleNext();
  return () => clearTimeout(timer);
};
