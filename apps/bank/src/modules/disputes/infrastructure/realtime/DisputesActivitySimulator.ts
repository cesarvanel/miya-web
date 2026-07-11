import type { FakeRealtimeClient } from '@/config/stores/socket/realtime';
import type { AgentHistory, ClientHistory } from '../../domain/entities/Dispute';
import { disputeOpened } from '../../domain/events/Events';

interface ScriptEntry {
  zone: string;
  agent: { id: string; name: string; enteredAmount: number };
  client: { id: string; name: string; declaredAmount: number };
  clientHistory: ClientHistory;
  agentHistory: AgentHistory;
}

/** Uniquement des agents en tournée (OnRound) du seed dashboard. */
const SCRIPT: ScriptEntry[] = [
  {
    zone: 'Marché Mokolo',
    agent: { id: 'agent-cedric-nkoulou', name: 'Cédric Nkoulou', enteredAmount: 1_000 },
    client: { id: 'client-solange-meka', name: 'Solange Meka', declaredAmount: 1_500 },
    clientHistory: { regularity: { onTime: 27, total: 28 }, disputesLast12Months: 0, clientSince: '2023' },
    agentHistory: { confirmationRate: 96.8, disputesLast12Months: 2, settlementGaps: 0 },
  },
  {
    zone: 'Marché Mokolo',
    agent: { id: 'agent-rosalie-fotso', name: 'Rosalie Fotso', enteredAmount: 2_000 },
    client: { id: 'client-vincent-abega', name: 'Vincent Abega', declaredAmount: 2_500 },
    clientHistory: { regularity: { onTime: 22, total: 25 }, disputesLast12Months: 1, clientSince: '2023' },
    agentHistory: { confirmationRate: 94.5, disputesLast12Months: 1, settlementGaps: 1 },
  },
];

const MIN_DELAY_MS = 25_000;
const MAX_DELAY_MS = 45_000;

/**
 * Simule une contestation occasionnelle (dev/démo, pas de backend) — jamais
 * de mutation directe du domaine depuis l'infra, uniquement l'événement typé
 * (`domain/events`) que ce slice ET celui de `dashboard` savent traiter.
 */
export const startDisputesActivitySimulation = (
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
        type: disputeOpened.type,
        payload: entry,
      });
      scheduleNext();
    }, delay);
  };

  scheduleNext();
  return () => clearTimeout(timer);
};
