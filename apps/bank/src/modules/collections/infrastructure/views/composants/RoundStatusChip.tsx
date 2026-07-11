import React from 'react';
import type { RoundStatus } from '../../../domain/entities/CollectionRound';

interface RoundStatusChipProps {
  status: RoundStatus;
}

const classes: Record<RoundStatus, string> = {
  Open: 'bg-primary-soft text-primary',
  Closed: 'bg-danger-soft text-danger',
};

const labels: Record<RoundStatus, string> = {
  Open: 'En tournée',
  Closed: 'Clôturée',
};

export const RoundStatusChip: React.FC<RoundStatusChipProps> = ({ status }) => (
  <span className={['w-fit rounded-full px-[11px] py-[6px] text-[11.5px] font-bold whitespace-nowrap', classes[status]].join(' ')}>
    {labels[status]}
  </span>
);
