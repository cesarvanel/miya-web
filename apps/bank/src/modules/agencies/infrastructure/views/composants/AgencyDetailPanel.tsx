import React from 'react';
import type { Agency } from '../../../domain/entities/Agency';

interface AgencyDetailPanelProps {
  agency: Agency;
}

const fcfa = (amount: number): string => `${amount.toLocaleString('fr-FR')} FCFA`;

/** Carte sombre récapitulant l'agence sélectionnée (clients, épargne, responsable). Maquette 8a. */
export const AgencyDetailPanel: React.FC<AgencyDetailPanelProps> = ({ agency }) => (
  <div className="rounded-2xl bg-primary-deep p-5.5 text-white">
    <div className="text-[12px] font-bold tracking-[.05em] text-primary-bright uppercase">{agency.name}</div>
    <div className="mt-3 flex flex-col gap-2.25">
      <div className="flex items-center justify-between">
        <span className="text-[12.5px] font-medium text-white/60">Clients rattachés</span>
        <span className="num text-[14px] font-bold">{agency.clientsCount.toLocaleString('fr-FR')}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-[12.5px] font-medium text-white/60">Épargne gérée</span>
        <span className="num text-[14px] font-bold">{fcfa(agency.savingsManaged)}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-[12.5px] font-medium text-white/60">Responsable</span>
        <span className="text-[14px] font-bold">{agency.managerName}</span>
      </div>
    </div>
  </div>
);
