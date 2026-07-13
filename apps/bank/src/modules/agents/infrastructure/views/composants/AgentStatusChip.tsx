import React from 'react';
import { AgentStatus } from '../../../domain/entities/Agent';

interface AgentStatusChipProps {
  status: AgentStatus;
}

/** « Actif » / « À activer » / « Suspendu ». */
export const AgentStatusChip: React.FC<AgentStatusChipProps> = ({ status }) => {
  if (status === AgentStatus.PendingActivation) {
    return (
      <span className="rounded-full bg-amber-soft px-[10px] py-1 text-[11px] font-bold whitespace-nowrap text-amber">
        À activer
      </span>
    );
  }
  if (status === AgentStatus.Suspended) {
    return (
      <span className="rounded-full bg-danger-soft px-[10px] py-1 text-[11px] font-bold whitespace-nowrap text-danger">
        Suspendu
      </span>
    );
  }
  return (
    <span className="bg-primary-soft text-primary rounded-full px-[10px] py-1 text-[11px] font-bold whitespace-nowrap">
      Actif
    </span>
  );
};
