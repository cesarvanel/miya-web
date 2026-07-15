import React from 'react';
import type { Agent } from '../../../domain/entities/Agent';

interface DeviceCellProps {
  agent: Pick<Agent, 'role' | 'status' | 'device'>;
}

/** Modèle de l'appareil lié, ou alerte « Appareil non lié »/« Appareil révoqué ». Sans objet pour un responsable (portail web). */
export const DeviceCell: React.FC<DeviceCellProps> = ({ agent }) => {
  if (agent.role === 'Supervisor') {
    return <span className="text-[12px] font-medium text-ink-faint">Web · portail</span>;
  }
  if (agent.device) {
    return <span className="text-[12px] font-semibold text-ink-muted">{agent.device.model}</span>;
  }
  const label = agent.status === 'PendingActivation' ? 'Appareil non lié' : 'Appareil révoqué';
  return <span className="text-[12px] font-bold text-danger">{label}</span>;
};
