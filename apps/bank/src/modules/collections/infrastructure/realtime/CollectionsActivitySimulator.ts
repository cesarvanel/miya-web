import type { FakeRealtimeClient } from '@/config/stores/socket/realtime';
import { collectionConfirmed } from '../../domain/events/Events';

interface ScriptEntry {
  roundId: string;
  agentId: string;
  stopId: string;
  clientName: string;
  amount: number;
}

/**
 * Uniquement les stops « À visiter » nommés de la tournée de Cédric (seed
 * `FakeCollectionGateway`) — jamais les stops générés en remplissage, pour
 * ne pas coupler ce script à l'algorithme de génération interne du gateway.
 */
const SCRIPT: ScriptEntry[] = [
  {
    roundId: 'agent-cedric-nkoulou',
    agentId: 'agent-cedric-nkoulou',
    stopId: 'stop-cedric-06',
    clientName: 'Robert Biya',
    amount: 1_100,
  },
  {
    roundId: 'agent-cedric-nkoulou',
    agentId: 'agent-cedric-nkoulou',
    stopId: 'stop-cedric-07',
    clientName: 'Alice Fouda',
    amount: 1_000,
  },
  {
    roundId: 'agent-cedric-nkoulou',
    agentId: 'agent-cedric-nkoulou',
    stopId: 'stop-cedric-08',
    clientName: 'Daniel Manga',
    amount: 1_200,
  },
];

const MIN_DELAY_MS = 8_000;
const MAX_DELAY_MS = 15_000;

/**
 * Fait « vivre » une tournée ouverte (dev/démo, pas de backend) : toutes les
 * 8-15s, un stop passe Collected — jamais de mutation directe du domaine
 * depuis l'infra, uniquement l'événement typé (`domain/events`) que ce slice
 * ET celui de `dashboard` savent traiter (unification des events).
 */
export const startCollectionsActivitySimulation = (
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
          roundId: entry.roundId,
          agentId: entry.agentId,
          stopId: entry.stopId,
          clientName: entry.clientName,
          amount: entry.amount,
        },
      });
      scheduleNext();
    }, delay);
  };

  scheduleNext();
  return () => clearTimeout(timer);
};
