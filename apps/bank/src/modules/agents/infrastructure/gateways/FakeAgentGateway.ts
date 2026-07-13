import type { AgentGateway } from '../../application/ports/AgentGateway';
import type { CreateAgentCommand } from '../../application/usecases/create-agent-async/CreateAgentCommand';
import type { CreateAgentResponse } from '../../application/usecases/create-agent-async/CreateAgentResponse';
import type { FetchAgentDayRecordsResponse } from '../../application/usecases/fetch-agent-day-records-async/FetchAgentDayRecordsResponse';
import type { FetchAgentResponse } from '../../application/usecases/fetch-agent-async/FetchAgentResponse';
import type { FetchAgentsResponse } from '../../application/usecases/fetch-agents-async/FetchAgentsResponse';
import type { GenerateActivationCodeResponse } from '../../application/usecases/generate-activation-code-async/GenerateActivationCodeResponse';
import { AgentRole, AgentStatus, type Agent } from '../../domain/entities/Agent';
import { AgentSettlementStatus, type AgentDayRecord } from '../../domain/entities/AgentDayRecord';

const AGENCY = 'Agence Mokolo';

/**
 * Agents/responsables repris avec les MÊMES ids que `config/fixtures/AgentsRosterFixture`
 * (dashboard/collections) et que les `assignedAgent.id` du module clients — même
 * matricule (« code ») que dans ce roster, pour que la fiche agent raconte
 * exactement la même histoire que partout ailleurs dans l'app.
 */
const seedAgents = (): Agent[] => [
  {
    id: 'agent-cedric-nkoulou',
    fullName: 'Cédric Nkoulou',
    registrationNumber: 'AGT-04127',
    role: AgentRole.Collector,
    supervisor: { id: 'agent-antoine-mbarga', name: 'Antoine Mbarga' },
    agency: AGENCY,
    zones: ['Marché Mokolo'],
    status: AgentStatus.Active,
    device: { model: 'Tecno Spark 20', os: 'Android 14', maskedImei: '••• 7842', linkedAt: '12 fév. 2024' },
    monthStats: { collected: 742_000, confirmationRate: 98.4, gaps: 0 },
    lastActivationCodeGeneratedAt: null,
  },
  {
    id: 'agent-grace-atangana',
    fullName: 'Grace Atangana',
    registrationNumber: 'AGT-04102',
    role: AgentRole.Collector,
    supervisor: { id: 'agent-antoine-mbarga', name: 'Antoine Mbarga' },
    agency: AGENCY,
    zones: ['Carrefour Warda'],
    status: AgentStatus.Active,
    device: { model: 'Samsung A15', os: 'Android 14', maskedImei: '••• 2210', linkedAt: '3 mars 2024' },
    /** « 3 contest. » du brief — même chiffre que agentHistory.disputesLast12Months (module disputes). */
    monthStats: { collected: 688_500, confirmationRate: 96.5, gaps: 3 },
    lastActivationCodeGeneratedAt: null,
  },
  {
    id: 'agent-ibrahim-sali',
    fullName: 'Ibrahim Sali',
    registrationNumber: 'AGT-04088',
    role: AgentRole.Collector,
    supervisor: { id: 'agent-antoine-mbarga', name: 'Antoine Mbarga' },
    agency: AGENCY,
    zones: ['Mvog-Ada'],
    status: AgentStatus.Active,
    device: { model: 'Tecno Camon 20', os: 'Android 13', maskedImei: '••• 5561', linkedAt: '20 nov. 2023' },
    monthStats: { collected: 710_000, confirmationRate: 97.6, gaps: 1 },
    lastActivationCodeGeneratedAt: null,
  },
  {
    id: 'agent-rosalie-fotso',
    fullName: 'Rosalie Fotso',
    registrationNumber: 'AGT-04155',
    role: AgentRole.Collector,
    supervisor: { id: 'agent-antoine-mbarga', name: 'Antoine Mbarga' },
    agency: AGENCY,
    zones: ['Marché Mokolo'],
    status: AgentStatus.PendingActivation,
    device: null,
    monthStats: { collected: 0, confirmationRate: 0, gaps: 0 },
    lastActivationCodeGeneratedAt: null,
  },
  {
    id: 'agent-jean-baptiste-owona',
    fullName: 'Jean-Baptiste Owona',
    registrationNumber: 'AGT-04073',
    role: AgentRole.Collector,
    supervisor: { id: 'agent-pauline-owona', name: 'Pauline Owona' },
    agency: AGENCY,
    zones: ['Essos'],
    status: AgentStatus.Active,
    device: { model: 'Tecno Pop 8', os: 'Android 12', maskedImei: '••• 9034', linkedAt: '8 mai 2023' },
    monthStats: { collected: 470_000, confirmationRate: 95.8, gaps: 0 },
    lastActivationCodeGeneratedAt: null,
  },
  {
    id: 'agent-olivier-talla',
    fullName: 'Olivier Talla',
    registrationNumber: 'AGT-03991',
    role: AgentRole.Collector,
    supervisor: { id: 'agent-antoine-mbarga', name: 'Antoine Mbarga' },
    agency: AGENCY,
    zones: ['Etoudi'],
    status: AgentStatus.Suspended,
    device: null,
    monthStats: { collected: 0, confirmationRate: 0, gaps: 0 },
    lastActivationCodeGeneratedAt: null,
  },
  {
    id: 'agent-antoine-mbarga',
    fullName: 'Antoine Mbarga',
    registrationNumber: 'RSP-04001',
    role: AgentRole.Supervisor,
    supervisor: null,
    agency: AGENCY,
    zones: ['Marché Mokolo', 'Carrefour Warda', 'Mvog-Ada', 'Etoudi'],
    status: AgentStatus.Active,
    device: null,
    monthStats: { collected: 0, confirmationRate: 0, gaps: 0 },
    lastActivationCodeGeneratedAt: null,
  },
  {
    id: 'agent-pauline-owona',
    fullName: 'Pauline Owona',
    registrationNumber: 'RSP-04002',
    role: AgentRole.Supervisor,
    supervisor: null,
    agency: AGENCY,
    zones: ['Essos'],
    status: AgentStatus.Active,
    device: null,
    monthStats: { collected: 0, confirmationRate: 0, gaps: 0 },
    lastActivationCodeGeneratedAt: null,
  },
];

/** Journées & reversements — détaillées uniquement pour Cédric Nkoulou (donnée exacte du brief). */
const seedDayRecords = (): AgentDayRecord[] => [
  {
    id: 'day-cedric-0702',
    agentId: 'agent-cedric-nkoulou',
    date: '2026-07-02',
    collected: 41_500,
    settlementStatus: AgentSettlementStatus.Settled,
    settledAt: '18h20',
  },
  {
    id: 'day-cedric-0701',
    agentId: 'agent-cedric-nkoulou',
    date: '2026-07-01',
    collected: 38_000,
    settlementStatus: AgentSettlementStatus.Settled,
    settledAt: '18h05',
  },
  {
    id: 'day-cedric-0630',
    agentId: 'agent-cedric-nkoulou',
    date: '2026-06-30',
    collected: 36_500,
    settlementStatus: AgentSettlementStatus.SettledWithGap,
    settledAt: '18h42',
    gapAmount: -500,
    note: 'Rejet puis régularisé -500',
  },
];

const delay = (): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 300));

/** Gateway en mémoire — pas de backend. Latence simulée (300-600ms). */
export class FakeAgentGateway implements AgentGateway {
  private agents: Agent[] = seedAgents();
  private dayRecords: AgentDayRecord[] = seedDayRecords();
  private nextAgentSeq = 4189;
  private nextSupervisorSeq = 4003;

  async fetchAll(): Promise<FetchAgentsResponse> {
    await delay();
    return { agents: this.agents.map((agent) => structuredClone(agent)) };
  }

  async fetchOne(id: string): Promise<FetchAgentResponse> {
    await delay();
    const agent = this.agents.find((candidate) => candidate.id === id);
    if (!agent) {
      throw new Error(`Agent introuvable : ${id}`);
    }
    return { agent: structuredClone(agent) };
  }

  async fetchDayRecords(agentId: string): Promise<FetchAgentDayRecordsResponse> {
    await delay();
    return {
      records: this.dayRecords.filter((record) => record.agentId === agentId).map((record) => structuredClone(record)),
    };
  }

  async create(command: CreateAgentCommand): Promise<CreateAgentResponse> {
    await delay();
    const isSupervisor = command.role === AgentRole.Supervisor;
    const seq = isSupervisor ? this.nextSupervisorSeq++ : this.nextAgentSeq++;
    const supervisor = !isSupervisor && command.supervisorId
      ? this.agents.find((candidate) => candidate.id === command.supervisorId) ?? null
      : null;

    const agent: Agent = {
      id: `agent-${command.identity.fullName.toLowerCase().replace(/[^a-z]+/g, '-')}-${seq}`,
      fullName: command.identity.fullName,
      registrationNumber: `${isSupervisor ? 'RSP' : 'AGT'}-${seq}`,
      role: command.role,
      supervisor: supervisor ? { id: supervisor.id, name: supervisor.fullName } : null,
      agency: command.agency,
      zones: command.zones,
      status: AgentStatus.PendingActivation,
      device: null,
      monthStats: { collected: 0, confirmationRate: 0, gaps: 0 },
      lastActivationCodeGeneratedAt: null,
    };
    this.agents.push(agent);
    return { agent: structuredClone(agent) };
  }

  async revokeDevice(agentId: string, _reason: string): Promise<void> {
    await delay();
    const agent = this.agents.find((candidate) => candidate.id === agentId);
    if (!agent) {
      throw new Error(`Agent introuvable : ${agentId}`);
    }
    agent.device = null;
  }

  async generateActivationCode(agentId: string): Promise<GenerateActivationCodeResponse> {
    await delay();
    const agent = this.agents.find((candidate) => candidate.id === agentId);
    if (!agent) {
      throw new Error(`Agent introuvable : ${agentId}`);
    }
    const part1 = Math.floor(1000 + Math.random() * 9000);
    const part2 = Math.floor(1000 + Math.random() * 9000);
    return {
      code: `${part1} · ${part2}`,
      expiresAt: new Date(Date.now() + 24 * 3_600_000).toISOString(),
    };
  }

  async suspend(agentId: string, _reason: string): Promise<void> {
    await delay();
    const agent = this.agents.find((candidate) => candidate.id === agentId);
    if (!agent) {
      throw new Error(`Agent introuvable : ${agentId}`);
    }
    agent.status = AgentStatus.Suspended;
  }

  async reactivate(agentId: string): Promise<void> {
    await delay();
    const agent = this.agents.find((candidate) => candidate.id === agentId);
    if (!agent) {
      throw new Error(`Agent introuvable : ${agentId}`);
    }
    agent.status = AgentStatus.Active;
  }
}
