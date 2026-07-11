import React from 'react';
import type { RoundStopStatus } from '../../../domain/entities/RoundStop';

interface StopStatusDotProps {
  status: RoundStopStatus;
}

/** Couleurs des maquettes (légende « Clients de la tournée »). */
const dotColors: Record<RoundStopStatus, string> = {
  ToVisit: 'bg-[#C7C9C0]',
  Collected: 'bg-primary',
  Pending: 'bg-info',
  Absent: 'bg-[#9A9C93]',
  Postponed: 'bg-[#E08A1E]',
  OffRound: 'bg-ink-disabled',
};

export const StopStatusDot: React.FC<StopStatusDotProps> = ({ status }) => (
  <span className={['size-2.25 flex-none rounded-full', dotColors[status]].join(' ')} aria-hidden="true" />
);
