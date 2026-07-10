/**
 * Port temps réel de la console éditeur — même contrat que bank : l'adapter
 * réel dispatchera les events de domaine des modules.
 */
export interface RealtimeClient {
  connect: () => void;
  disconnect: () => void;
}

/** No-op tant qu'aucun backend temps réel n'est branché. */
export class FakeRealtimeClient implements RealtimeClient {
  connect(): void {
    // no-op
  }

  disconnect(): void {
    // no-op
  }
}
