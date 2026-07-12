import React from 'react';
import { Link } from 'react-router-dom';
import { InitialsAvatar } from '@miya/ui';

interface PartyCellProps {
  name: string;
  muted?: boolean;
  /** Si fourni, le nom devient un lien (ex. vers la fiche client). */
  to?: string;
}

export const PartyCell: React.FC<PartyCellProps> = ({ name, muted = false, to }) => {
  const nameClassName = [
    'truncate text-[13.5px] font-bold',
    muted ? 'text-ink-muted font-semibold' : 'text-ink',
    to ? 'hover:underline' : '',
  ].join(' ');

  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <InitialsAvatar name={name} size="sm" />
      {to ? (
        <Link to={to} onClick={(event) => event.stopPropagation()} className={nameClassName}>
          {name}
        </Link>
      ) : (
        <span className={nameClassName}>{name}</span>
      )}
    </div>
  );
};
