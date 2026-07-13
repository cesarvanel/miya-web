import type { CreateAgentCommand } from '../usecases/create-agent-async/CreateAgentCommand';
import type { CreateAgentResponse } from '../usecases/create-agent-async/CreateAgentResponse';
import type { FetchAgentDayRecordsResponse } from '../usecases/fetch-agent-day-records-async/FetchAgentDayRecordsResponse';
import type { FetchAgentResponse } from '../usecases/fetch-agent-async/FetchAgentResponse';
import type { FetchAgentsResponse } from '../usecases/fetch-agents-async/FetchAgentsResponse';
import type { GenerateActivationCodeResponse } from '../usecases/generate-activation-code-async/GenerateActivationCodeResponse';

export interface AgentGateway {
  fetchAll: () => Promise<FetchAgentsResponse>;
  fetchOne: (id: string) => Promise<FetchAgentResponse>;
  fetchDayRecords: (agentId: string) => Promise<FetchAgentDayRecordsResponse>;
  create: (command: CreateAgentCommand) => Promise<CreateAgentResponse>;
  revokeDevice: (agentId: string, reason: string) => Promise<void>;
  generateActivationCode: (agentId: string) => Promise<GenerateActivationCodeResponse>;
  suspend: (agentId: string, reason: string) => Promise<void>;
  reactivate: (agentId: string) => Promise<void>;
}
