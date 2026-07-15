import { AgentsSelectors } from './domain/selectors/Selectors';
import { agentsSlice } from './domain/slices/AgentsSlice';

// Types de domaine
export { AgentRole, AgentStatus, AgentsAdapter } from './domain/entities/Agent';
export type { Agent, AgentDevice, AgentMonthStats, AgentSupervisor } from './domain/entities/Agent';
export { AgentSettlementStatus, DayRecordsAdapter } from './domain/entities/AgentDayRecord';
export type { AgentDayRecord } from './domain/entities/AgentDayRecord';

// Reducer (branché dans RootReducer)
export const agentsReducer = agentsSlice.reducer;

// Selectors — groupés, comme prescrit par CLAUDE.md
export const agentSelectors = {
  ...AgentsSelectors,
};
export type { AgentsListFilters } from './domain/selectors/Selectors';

// Use cases
export { FetchAgentsAsync } from './application/usecases/fetch-agents-async/FetchAgentsAsync';
export type { FetchAgentsCommand } from './application/usecases/fetch-agents-async/FetchAgentsCommand';
export type { FetchAgentsResponse } from './application/usecases/fetch-agents-async/FetchAgentsResponse';

export { FetchAgentAsync } from './application/usecases/fetch-agent-async/FetchAgentAsync';
export type { FetchAgentCommand } from './application/usecases/fetch-agent-async/FetchAgentCommand';
export type { FetchAgentResponse } from './application/usecases/fetch-agent-async/FetchAgentResponse';

export { FetchAgentDayRecordsAsync } from './application/usecases/fetch-agent-day-records-async/FetchAgentDayRecordsAsync';
export type { FetchAgentDayRecordsCommand } from './application/usecases/fetch-agent-day-records-async/FetchAgentDayRecordsCommand';
export type { FetchAgentDayRecordsResponse } from './application/usecases/fetch-agent-day-records-async/FetchAgentDayRecordsResponse';

export { CreateAgentAsync } from './application/usecases/create-agent-async/CreateAgentAsync';
export type { CreateAgentCommand, CreateAgentIdentity } from './application/usecases/create-agent-async/CreateAgentCommand';
export type { CreateAgentResponse } from './application/usecases/create-agent-async/CreateAgentResponse';

export { RevokeDeviceAsync } from './application/usecases/revoke-device-async/RevokeDeviceAsync';
export type { RevokeDeviceCommand } from './application/usecases/revoke-device-async/RevokeDeviceCommand';

export { GenerateActivationCodeAsync } from './application/usecases/generate-activation-code-async/GenerateActivationCodeAsync';
export type { GenerateActivationCodeCommand } from './application/usecases/generate-activation-code-async/GenerateActivationCodeCommand';
export type { GenerateActivationCodeResponse } from './application/usecases/generate-activation-code-async/GenerateActivationCodeResponse';

export { SuspendAgentAsync } from './application/usecases/suspend-agent-async/SuspendAgentAsync';
export type { SuspendAgentCommand } from './application/usecases/suspend-agent-async/SuspendAgentCommand';

export { ReactivateAgentAsync } from './application/usecases/reactivate-agent-async/ReactivateAgentAsync';
export type { ReactivateAgentCommand } from './application/usecases/reactivate-agent-async/ReactivateAgentCommand';

// Ports (types utilisés par la composition root)
export type { AgentsDependencies } from './application/ports/AgentsDependencies';
export type { AgentGateway } from './application/ports/AgentGateway';

// Infrastructure (instanciée par la composition root)
export { FakeAgentGateway } from './infrastructure/gateways/FakeAgentGateway';
export { AgentsRouter } from './infrastructure/router/AgentsRouter';
export { AgentsRoutes } from './infrastructure/router/AgentsRoutes';
