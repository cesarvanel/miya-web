/**
 * Port temps réel de l'app bank.
 *
 * Entrant (serveur → store) : le socket est GREFFÉ AU STORE par le middleware
 * realtime (stores/middleware/Middleware.ts) : chaque événement serveur reçu
 * via `on()` est dispatché tel quel comme action Redux — les slices des
 * modules les traitent via extraReducers (events du domaine : agentCreated,
 * collectionConfirmed, …) qui patchent les entityAdapters et invalident les
 * tags de cache.
 *
 * Sortant (store → serveur) : `emit()` est appelé depuis un effect du listener
 * middleware (stores/middleware/Listener.ts) en réaction à une action déjà
 * dispatchée — jamais directement depuis un composant ou un use case.
 */
export interface RealtimeEvent {
  /** Type d'action Redux dispatché tel quel (ex. 'collections/collectionConfirmed'). */
  type: string;
  payload?: unknown;
}

export type RealtimeListener = (event: RealtimeEvent) => void;

export interface RealtimeClient {
  connect: () => void;
  disconnect: () => void;
  /** Abonne un listener aux événements serveur ; retourne le désabonnement. */
  on: (listener: RealtimeListener) => () => void;
  /** Émet un événement vers le serveur (ex. ack, action utilisateur temps réel). */
  emit: (event: RealtimeEvent) => void;
}

/**
 * Client no-op tant qu'aucun backend temps réel n'est branché.
 * `simulate()` permet de rejouer un événement serveur en dev/tests.
 * `emitted` garde une trace des événements sortants pour les assertions.
 */
export class FakeRealtimeClient implements RealtimeClient {
  private listeners = new Set<RealtimeListener>();
  readonly emitted: RealtimeEvent[] = [];

  connect(): void {
    // no-op — le vrai client (WebSocket/SSE) ouvrira la connexion ici.
  }

  disconnect(): void {
    // no-op
  }

  on(listener: RealtimeListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /** Simule la réception d'un événement serveur (dev/tests). */
  simulate(event: RealtimeEvent): void {
    this.listeners.forEach((listener) => listener(event));
  }

  emit(event: RealtimeEvent): void {
    this.emitted.push(event);
  }
}
