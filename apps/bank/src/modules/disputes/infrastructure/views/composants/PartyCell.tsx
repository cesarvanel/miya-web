import React from 'react';
import { InitialsAvatar } from '@miya/ui';

interface PartyCellProps {
  name: string;
  muted?: boolean;
}

export const PartyCell: React.FC<PartyCellProps> = ({ name, muted = false }) => (
  <div className="flex min-w-0 items-center gap-2.5">
    <InitialsAvatar name={name} size="sm" />
    <span className={['truncate text-[13.5px] font-bold', muted ? 'text-ink-muted font-semibold' : 'text-ink'].join(' ')}>
      {name}
    </span>
  </div>
);
