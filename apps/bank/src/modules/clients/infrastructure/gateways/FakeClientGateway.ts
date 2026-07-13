import type { ClientGateway } from '../../application/ports/ClientGateway';
import type { CreateClientCommand } from '../../application/usecases/create-client-async/CreateClientCommand';
import type { CreateClientResponse } from '../../application/usecases/create-client-async/CreateClientResponse';
import type { FetchClientOperationsResponse } from '../../application/usecases/fetch-client-operations-async/FetchClientOperationsResponse';
import type { FetchClientResponse } from '../../application/usecases/fetch-client-async/FetchClientResponse';
import type { FetchClientsResponse } from '../../application/usecases/fetch-clients-async/FetchClientsResponse';
import { ClientStatus, type Client } from '../../domain/entities/Client';
import { ClientOperationKind, ClientOperationStatus, type ClientOperation } from '../../domain/entities/ClientOperation';
import { DayOfWeek, EngagementPreset, type SavingsPlan } from '../../domain/entities/SavingsPlan';
import { computeSavingsPlanComputed } from '../../domain/services/SavingsPlanCalculator';

const daysAgo = (days: number): string => new Date(Date.now() - days * 86_400_000).toISOString();

const MON_SAT: DayOfWeek[] = [
  DayOfWeek.Monday,
  DayOfWeek.Tuesday,
  DayOfWeek.Wednesday,
  DayOfWeek.Thursday,
  DayOfWeek.Friday,
  DayOfWeek.Saturday,
];

/** Construit un plan d'épargne — `computed` est TOUJOURS dérivé via le service pur, jamais saisi. */
const buildSavingsPlan = (
  amountPerCollectionDay: number,
  collectionDays: DayOfWeek[],
  startDate: string,
  endDate: string,
  preset: EngagementPreset,
  openingDeposit?: number,
): SavingsPlan => ({
  amountPerCollectionDay,
  collectionDays,
  engagement: { startDate, endDate, preset },
  computed: computeSavingsPlanComputed(amountPerCollectionDay, collectionDays, startDate, endDate, openingDeposit ?? 0),
  openingDeposit,
});

/**
 * Clients repris des fixtures des autres modules quand la même personne y
 * apparaît déjà (Bernadette Ngo, Christine Eyenga, Jean-Pierre Etoa, Sylvie
 * Mballa — mêmes ids que dans collections/disputes), pour que la fiche
 * client soit cohérente avec ce qu'on voit déjà ailleurs dans l'app. Les
 * jours de collecte couvrent tous « aujourd'hui » (lundi) pour rester
 * cohérents avec la feuille de route des tournées (FakeCollectionGateway).
 */
const seedClients = (): Client[] => [
  {
    id: 'client-bernadette-ngo',
    fullName: 'Bernadette Ngo',
    activity: 'Vendeuse de beignets',
    zone: 'Marché Mokolo',
    assignedAgent: { id: 'agent-cedric-nkoulou', name: 'Cédric Nkoulou' },
    phone: '678451209',
    idDocument: { type: 'CNI', maskedNumber: 'CNI ••• 4471' },
    hasSmartphone: false,
    clientSince: '2023-03-01',
    status: ClientStatus.Active,
    /** 1 000/jour, Lun-Sam, engagement 6 mois démarré en mars → objectif ~156 000, jauge ~28% (solde 43 500). */
    savingsPlan: buildSavingsPlan(1_000, MON_SAT, '2026-03-01', '2026-09-01', EngagementPreset.SixMonths),
    savingsBalance: 43_500,
    regularity: { contributed: 27, expected: 30 },
    pendingWithdrawal: { amount: 15_000, requestedAt: 'hier' },
  },
  {
    id: 'client-christine-eyenga',
    fullName: 'Christine Eyenga',
    activity: 'Commerçante · Pagnes',
    zone: 'Carrefour Warda',
    assignedAgent: { id: 'agent-grace-atangana', name: 'Grace Atangana' },
    phone: '699412208',
    idDocument: { type: 'CNI', maskedNumber: 'CNI ••• 7702' },
    hasSmartphone: true,
    clientSince: '2022-01-01',
    status: ClientStatus.Active,
    savingsPlan: buildSavingsPlan(1_000, MON_SAT, '2026-01-05', '2027-01-05', EngagementPreset.OneYear),
    savingsBalance: 128_500,
    regularity: { contributed: 29, expected: 30 },
    pendingWithdrawal: { amount: 50_000, requestedAt: "aujourd'hui 14h52" },
  },
  {
    id: 'client-jean-pierre-etoa',
    fullName: 'Jean-Pierre Etoa',
    activity: 'Quincaillerie',
    zone: 'Marché Mokolo',
    assignedAgent: { id: 'agent-cedric-nkoulou', name: 'Cédric Nkoulou' },
    phone: '677124509',
    idDocument: { type: 'CNI', maskedNumber: 'CNI ••• 3390' },
    hasSmartphone: true,
    clientSince: '2021-06-01',
    status: ClientStatus.Active,
    savingsPlan: buildSavingsPlan(1_500, MON_SAT, '2026-02-02', '2026-08-02', EngagementPreset.SixMonths),
    savingsBalance: 67_000,
    regularity: { contributed: 26, expected: 30 },
    pendingWithdrawal: null,
  },
  {
    id: 'client-marthe-tchoumi',
    fullName: 'Marthe Tchoumi',
    activity: 'Restauration',
    zone: 'Mvog-Ada',
    assignedAgent: { id: 'agent-ibrahim-sali', name: 'Ibrahim Sali' },
    phone: '655307144',
    idDocument: { type: 'CNI', maskedNumber: 'CNI ••• 5566' },
    hasSmartphone: true,
    clientSince: '2021-01-01',
    status: ClientStatus.Active,
    savingsPlan: buildSavingsPlan(
      2_000,
      [DayOfWeek.Monday, DayOfWeek.Tuesday, DayOfWeek.Wednesday, DayOfWeek.Thursday, DayOfWeek.Friday],
      '2025-09-01',
      '2026-09-01',
      EngagementPreset.OneYear,
    ),
    savingsBalance: 210_000,
    regularity: { contributed: 21, expected: 30 },
    pendingWithdrawal: null,
  },
  {
    id: 'client-sylvie-mballa',
    fullName: 'Sylvie Mballa',
    activity: 'Épicerie',
    zone: 'Marché Mokolo',
    assignedAgent: { id: 'agent-cedric-nkoulou', name: 'Cédric Nkoulou' },
    phone: '691220987',
    idDocument: { type: 'CNI', maskedNumber: 'CNI ••• 8814' },
    hasSmartphone: true,
    clientSince: '2022-05-01',
    status: ClientStatus.Active,
    savingsPlan: buildSavingsPlan(1_000, MON_SAT, '2026-06-01', '2026-09-01', EngagementPreset.ThreeMonths),
    savingsBalance: 31_000,
    regularity: { contributed: 28, expected: 30 },
    pendingWithdrawal: null,
  },
  {
    id: 'client-pauline-manga',
    fullName: 'Pauline Manga',
    activity: 'Couture',
    zone: 'Essos',
    assignedAgent: { id: 'agent-jean-baptiste-owona', name: 'Jean-Baptiste Owona' },
    phone: '696330218',
    idDocument: { type: 'CNI', maskedNumber: 'CNI ••• 2201' },
    hasSmartphone: true,
    clientSince: '2026-05-01',
    status: ClientStatus.Active,
    savingsPlan: buildSavingsPlan(
      500,
      [DayOfWeek.Monday, DayOfWeek.Wednesday, DayOfWeek.Friday],
      '2026-06-01',
      '2026-09-01',
      EngagementPreset.ThreeMonths,
    ),
    savingsBalance: 9_000,
    regularity: { contributed: 22, expected: 30 },
    pendingWithdrawal: null,
  },
  {
    id: 'client-emmanuel-bila',
    fullName: 'Emmanuel Bila',
    activity: 'Menuiserie',
    zone: 'Marché Mokolo',
    assignedAgent: { id: 'agent-cedric-nkoulou', name: 'Cédric Nkoulou' },
    phone: '675889012',
    idDocument: { type: 'CNI', maskedNumber: 'CNI ••• 6630' },
    hasSmartphone: true,
    clientSince: '2022-09-01',
    status: ClientStatus.Active,
    savingsPlan: buildSavingsPlan(1_200, MON_SAT, '2026-04-01', '2026-10-01', EngagementPreset.SixMonths),
    savingsBalance: 54_000,
    regularity: { contributed: 27, expected: 30 },
    pendingWithdrawal: { amount: 20_000, requestedAt: 'il y a 2 jours' },
  },
];

/** Historique exact demandé pour Bernadette Ngo — dépôt d'ouverture, cotisations, retrait, frais de tenue de compte. */
const seedOperations = (): ClientOperation[] => [
  {
    id: 'op-bernadette-01',
    clientId: 'client-bernadette-ngo',
    kind: ClientOperationKind.Collection,
    amount: 1_000,
    occurredAt: daysAgo(0),
    agentName: 'Cédric Nkoulou',
    status: ClientOperationStatus.Completed,
  },
  {
    id: 'op-bernadette-02',
    clientId: 'client-bernadette-ngo',
    kind: ClientOperationKind.Withdrawal,
    amount: -20_000,
    occurredAt: '2026-06-12T15:40:00.000Z',
    agentName: 'A. Mbarga',
    status: ClientOperationStatus.Completed,
  },
  {
    id: 'op-bernadette-03',
    clientId: 'client-bernadette-ngo',
    kind: ClientOperationKind.Collection,
    amount: 1_000,
    occurredAt: '2026-06-11T08:30:00.000Z',
    agentName: 'Cédric Nkoulou',
    status: ClientOperationStatus.Completed,
  },
  {
    id: 'op-bernadette-04',
    clientId: 'client-bernadette-ngo',
    kind: ClientOperationKind.CustodyFee,
    amount: -200,
    occurredAt: '2026-06-01T00:00:00.000Z',
    status: ClientOperationStatus.Completed,
  },
  {
    id: 'op-bernadette-00',
    clientId: 'client-bernadette-ngo',
    kind: ClientOperationKind.OpeningDeposit,
    amount: 2_000,
    occurredAt: '2026-03-01T09:00:00.000Z',
    agentName: 'Cédric Nkoulou',
    status: ClientOperationStatus.Completed,
  },
];

const TOTAL_ACTIVE_CLIENTS_LABEL = 1_284;

const delay = (): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 300));

/** Gateway en mémoire — pas de backend. Latence simulée (300-600ms). */
export class FakeClientGateway implements ClientGateway {
  private clients: Client[] = seedClients();
  private operations: ClientOperation[] = seedOperations();
  private nextClientSeq = 514;

  async fetchAll(): Promise<FetchClientsResponse> {
    await delay();
    return {
      clients: this.clients.map((client) => structuredClone(client)),
      totalActiveClientsLabel: TOTAL_ACTIVE_CLIENTS_LABEL,
    };
  }

  async fetchOne(id: string): Promise<FetchClientResponse> {
    await delay();
    const client = this.clients.find((candidate) => candidate.id === id);
    if (!client) {
      throw new Error(`Client introuvable : ${id}`);
    }
    return { client: structuredClone(client) };
  }

  async fetchOperations(clientId: string): Promise<FetchClientOperationsResponse> {
    await delay();
    return {
      operations: this.operations.filter((op) => op.clientId === clientId).map((op) => structuredClone(op)),
    };
  }

  async create(command: CreateClientCommand): Promise<CreateClientResponse> {
    await delay();
    this.nextClientSeq += 1;
    const { savingsPlan: plan } = command;
    const client: Client = {
      id: `client-${command.identity.fullName.toLowerCase().replace(/[^a-z]+/g, '-')}-${this.nextClientSeq}`,
      fullName: command.identity.fullName,
      activity: command.identity.activity,
      zone: command.assignment.zone,
      assignedAgent: { id: command.assignment.agentId, name: command.assignment.agentName },
      phone: command.identity.phone,
      idDocument: {
        type: 'CNI',
        maskedNumber: `CNI ••• ${command.identity.cniNumber.slice(-4)}`,
      },
      hasSmartphone: command.hasSmartphone,
      clientSince: new Date().toISOString().slice(0, 10),
      status: ClientStatus.Active,
      savingsPlan: buildSavingsPlan(
        plan.amountPerCollectionDay,
        plan.collectionDays,
        plan.startDate,
        plan.endDate,
        plan.preset,
        plan.openingDeposit,
      ),
      savingsBalance: plan.openingDeposit ?? 0,
      regularity: { contributed: 0, expected: 0 },
      pendingWithdrawal: null,
    };
    this.clients.push(client);

    if (plan.openingDeposit) {
      this.operations.push({
        id: `op-${client.id}-opening`,
        clientId: client.id,
        kind: ClientOperationKind.OpeningDeposit,
        amount: plan.openingDeposit,
        occurredAt: new Date().toISOString(),
        agentName: command.assignment.agentName,
        status: ClientOperationStatus.Completed,
      });
    }

    return { client: structuredClone(client) };
  }

  async updateSavingsPlan(id: string, amountPerCollectionDay: number, collectionDays: DayOfWeek[]): Promise<void> {
    await delay();
    const client = this.clients.find((candidate) => candidate.id === id);
    if (!client) {
      throw new Error(`Client introuvable : ${id}`);
    }
    client.savingsPlan = buildSavingsPlan(
      amountPerCollectionDay,
      collectionDays,
      client.savingsPlan.engagement.startDate,
      client.savingsPlan.engagement.endDate,
      client.savingsPlan.engagement.preset,
      client.savingsPlan.openingDeposit,
    );
  }

  async deactivate(id: string, _reason: string): Promise<void> {
    await delay();
    const client = this.clients.find((candidate) => candidate.id === id);
    if (!client) {
      throw new Error(`Client introuvable : ${id}`);
    }
    client.status = ClientStatus.Inactive;
  }
}
