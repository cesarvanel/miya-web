import type { AgentRole } from '../../../domain/entities/Agent';

export interface CreateAgentIdentity {
  fullName: string;
  /** 9 chiffres camerounais, sans mise en forme — validé via PhoneNumber du kernel. */
  phone: string;
  cniNumber: string;
}

export interface CreateAgentCommand {
  identity: CreateAgentIdentity;
  role: AgentRole;
  /** Requis quand role === Collector — un responsable n'a pas de responsable. */
  supervisorId?: string;
  agency: string;
  zones: string[];
}
