import React from 'react';
import { AgentRole } from '../../../domain/entities/Agent';

interface RoleBadgeProps {
  role: AgentRole;
}

/** « Agent » (vert) / « Responsable » (violet) — cohérent avec la maquette. */
export const RoleBadge: React.FC<RoleBadgeProps> = ({ role }) =>
  role === AgentRole.Supervisor ? (
    <span className="w-fit rounded-full bg-[#EEE7F7] px-[10px] py-1 text-[11.5px] font-bold whitespace-nowrap text-[#7A56A8]">
      Responsable
    </span>
  ) : (
    <span className="bg-primary-soft text-primary w-fit rounded-full px-[10px] py-1 text-[11.5px] font-bold whitespace-nowrap">
      Agent
    </span>
  );
