import React from 'react';
import type { ClientRegularity } from '../../../domain/entities/Client';

interface CotisationCalendarProps {
  regularity: ClientRegularity;
}

/**
 * Grille de cotisation simplifiée : `contributed` cases cotisées (vertes),
 * le reste non cotisé (grises) — pas de détail jour par jour dans le
 * domaine, contrairement à la maquette qui distingue aussi « Supplément. ».
 */
export const CotisationCalendar: React.FC<CotisationCalendarProps> = ({ regularity }) => (
  <div>
    <div className="grid grid-cols-[repeat(15,minmax(0,1fr))] gap-[7px]">
      {Array.from({ length: regularity.expected }, (_, index) => (
        <div
          key={index}
          className={['aspect-square rounded-[6px]', index < regularity.contributed ? 'bg-primary' : 'bg-cream-100'].join(' ')}
        />
      ))}
    </div>
    <div className="mt-3.5 flex gap-4 text-[11.5px] font-semibold text-ink-muted">
      <span className="flex items-center gap-1.5">
        <span className="bg-primary size-2.5 rounded-[3px]" />
        Cotisé
      </span>
      <span className="flex items-center gap-1.5">
        <span className="size-2.5 rounded-[3px] bg-cream-100" />
        Non cotisé
      </span>
    </div>
  </div>
);
