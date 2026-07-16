import React from 'react';
import type { AgencyBreakdownEntry } from '../../../domain/entities/Supervision';

interface AgencyBreakdownListProps {
  breakdown: AgencyBreakdownEntry[];
}

const fcfa = (amount: number): string => `${amount.toLocaleString('fr-FR')} FCFA`;

/** Part de collecte par agence — barres horizontales. Maquette 10b. */
export const AgencyBreakdownList: React.FC<AgencyBreakdownListProps> = ({ breakdown }) => (
  <div className="rounded-card-lg border border-line bg-card p-5">
    <div className="mb-3.5 text-[15px] font-extrabold text-ink">Part de collecte par agence</div>
    <div className="flex flex-col gap-3.5">
      {breakdown.map((entry) => (
        <div key={entry.agencyName}>
          <div className="flex items-center justify-between text-[13px]">
            <span className="font-bold text-ink">Agence {entry.agencyName}</span>
            <span className="num font-bold text-ink-muted">
              {fcfa(entry.amount)} · {entry.share}%
            </span>
          </div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-cream-100">
            <div className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out" style={{ width: `${entry.share}%` }} />
          </div>
        </div>
      ))}
    </div>
  </div>
);
