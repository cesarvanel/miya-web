import React from 'react';
import type { ClientRegularity } from '../../../domain/entities/Client';

interface RegularityCellProps {
  regularity: ClientRegularity;
}

export const regularityPercent = (regularity: ClientRegularity): number =>
  regularity.expected === 0 ? 100 : Math.round((regularity.contributed / regularity.expected) * 100);

export const RegularityCell: React.FC<RegularityCellProps> = ({ regularity }) => {
  const percent = regularityPercent(regularity);
  const isLow = percent < 80;
  return (
    <span className={['num text-[13px] font-bold', isLow ? 'text-amber' : 'text-primary'].join(' ')}>
      {percent}%
    </span>
  );
};
