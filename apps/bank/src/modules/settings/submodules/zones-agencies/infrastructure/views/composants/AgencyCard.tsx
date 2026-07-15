import React from 'react';
import type { Agency } from '../../../domain/entities/Agency';

interface AgencyCardProps {
  agency: Agency;
  zoneCount: number;
  active: boolean;
  onSelect: (agencyId: string) => void;
}

const AgencyIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M4 8l6-4 6 4v8H4V8z" stroke={active ? '#fff' : '#0A6B4E'} strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M8 16v-4h4v4" stroke={active ? '#fff' : '#0A6B4E'} strokeWidth="1.5" />
  </svg>
);

/** Carte d'agence sélectionnable — bordure verte + icône pleine quand active. Maquette 8a. */
export const AgencyCard: React.FC<AgencyCardProps> = ({ agency, zoneCount, active, onSelect }) => (
  <button
    type="button"
    onClick={() => onSelect(agency.id)}
    className={[
      'flex w-full cursor-pointer items-center gap-2.5 rounded-2xl border p-3.25 text-left transition',
      active ? 'border-2 border-primary bg-cream' : 'border-line bg-card hover:border-primary/30',
    ].join(' ')}
  >
    <div className={['flex size-9.5 flex-none items-center justify-center rounded-xl', active ? 'bg-primary' : 'bg-primary-soft'].join(' ')}>
      <AgencyIcon active={active} />
    </div>
    <div className="min-w-0 flex-1">
      <div className="truncate text-[14px] font-bold text-ink">{agency.name}</div>
      <div className="text-[11.5px] font-semibold text-ink-muted">
        {zoneCount} zone{zoneCount > 1 ? 's' : ''} · {agency.agentsCount} agent{agency.agentsCount > 1 ? 's' : ''}
      </div>
    </div>
  </button>
);
