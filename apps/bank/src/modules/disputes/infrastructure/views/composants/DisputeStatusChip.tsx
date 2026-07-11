import React from 'react';
import type { DisputeDecision } from '../../../domain/entities/Dispute';

interface DisputeStatusChipProps {
  decidedInFavorOf?: DisputeDecision;
}

const toneClasses: Record<'pending' | 'Client' | 'Agent', string> = {
  pending: 'bg-amber-soft text-amber',
  Client: 'bg-primary-soft text-primary',
  Agent: 'bg-info-soft text-info',
};

const labels: Record<'pending' | 'Client' | 'Agent', string> = {
  pending: 'En attente',
  Client: 'Faveur client',
  Agent: 'Faveur agent',
};

/** Chip de statut — « En attente » (ouverte) ou l'issue (résolue). */
export const DisputeStatusChip: React.FC<DisputeStatusChipProps> = ({ decidedInFavorOf }) => {
  const key = decidedInFavorOf ?? 'pending';
  return (
    <span className={['rounded-full px-[11px] py-[5px] text-[11px] font-bold whitespace-nowrap', toneClasses[key]].join(' ')}>
      {labels[key]}
    </span>
  );
};
