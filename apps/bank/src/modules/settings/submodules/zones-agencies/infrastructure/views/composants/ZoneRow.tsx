import React from 'react';
import { InitialsAvatar } from '@miya/ui';
import type { CollectionZone } from '../../../domain/entities/CollectionZone';

interface ZoneRowProps {
  zone: CollectionZone;
  onAssignAgent: (zoneId: string) => void;
  index?: number;
}

const ZoneIcon: React.FC<{ unassigned: boolean }> = ({ unassigned }) => (
  <div className={['flex size-8.5 flex-none items-center justify-center rounded-[10px]', unassigned ? 'bg-danger-soft' : 'bg-primary-soft'].join(' ')}>
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden="true">
      <path d="M8.5 15s5-4 5-8a5 5 0 0 0-10 0c0 4 5 8 5 8z" stroke={unassigned ? '#C43B32' : '#0A6B4E'} strokeWidth="1.4" />
      <circle cx="8.5" cy="7" r="1.8" stroke={unassigned ? '#C43B32' : '#0A6B4E'} strokeWidth="1.4" />
    </svg>
  </div>
);

/** Ligne d'une zone de collecte — agent affecté ou pastille « Affecter un agent ». Maquette 8a. */
export const ZoneRow: React.FC<ZoneRowProps> = ({ zone, onAssignAgent, index = 0 }) => {
  const unassigned = !zone.assignedAgentName;

  return (
    <div
      className="animate-stagger-in group grid grid-cols-[2fr_1.6fr_1fr_1fr_24px] items-center gap-3.5 border-b border-line-soft px-5.5 py-3.5 transition-colors last:border-b-0 hover:bg-cream-50"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <div className="flex items-center gap-2.5">
        <ZoneIcon unassigned={unassigned} />
        <div className="min-w-0">
          <div className="truncate text-[13.5px] font-bold text-ink">{zone.name}</div>
          <div className="truncate text-[11.5px] font-medium text-ink-faint">{zone.sector}</div>
        </div>
      </div>

      {unassigned ? (
        <button
          type="button"
          onClick={() => onAssignAgent(zone.id)}
          className="animate-badge-in flex w-fit cursor-pointer items-center gap-2 rounded-[10px] border-[1.5px] border-dashed border-danger/40 bg-card px-3 py-1.5 text-[12.5px] font-bold text-danger"
        >
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
            <path d="M7.5 3v9M3 7.5h9" stroke="#C43B32" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          Affecter un agent
        </button>
      ) : (
        <button
          type="button"
          onClick={() => onAssignAgent(zone.id)}
          className="flex w-fit cursor-pointer items-center gap-2 rounded-lg py-1 pr-1 text-left hover:bg-cream-50"
        >
          <InitialsAvatar name={zone.assignedAgentName as string} size="sm" />
          <span className="text-[13px] font-bold text-ink">{zone.assignedAgentName}</span>
        </button>
      )}

      <span className="num text-right text-[13.5px] font-bold text-ink">{zone.clientsCount}</span>
      <span className={['num text-right text-[13px] font-bold', zone.regularityRate !== null ? 'text-primary' : 'text-ink-faint'].join(' ')}>
        {zone.regularityRate !== null ? `${zone.regularityRate}%` : '—'}
      </span>
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
        <path d="M7 4l5 5-5 5" stroke="#B9BAB2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
};
