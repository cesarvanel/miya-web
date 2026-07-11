import React from 'react';
import { AgentDayStatus } from '@/modules/dashboard/domain/entities/AgentDaySummary';

interface AgentStatusCellProps {
  status: AgentDayStatus;
  openDisputesCount: number;
  onOpenSlip: () => void;
  onOpenDisputes: () => void;
}

/**
 * Colonne "Statut" — le badge "Reversement en attente" est un vrai bouton
 * (élévation + flèche au survol, contrairement à la maquette) puisqu'il
 * navigue vers le bordereau ; la mention "N contestation(s)" est cliquable
 * séparément (stopPropagation pour ne pas déclencher le clic de ligne).
 */
export const AgentStatusCell: React.FC<AgentStatusCellProps> = ({
  status,
  openDisputesCount,
  onOpenSlip,
  onOpenDisputes,
}) => (
  <div className="flex flex-col items-start gap-[4px]">
    {status === AgentDayStatus.SettlementPending ? (
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onOpenSlip();
        }}
        className="group flex cursor-pointer items-center gap-[6px] rounded-full bg-danger-soft px-[11px] py-[6px] text-[11.5px] font-bold text-danger transition hover:-translate-y-px hover:bg-danger hover:text-white hover:shadow-danger-glow"
      >
        Reversement en attente
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden="true"
          className="transition-transform group-hover:translate-x-0.5"
        >
          <path
            d="M4.5 2.5l3.5 3.5-3.5 3.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    ) : status === AgentDayStatus.Validated ? (
      <span className="rounded-full bg-info-soft px-[11px] py-[6px] text-[11.5px] font-bold text-info">
        Validé ✓
      </span>
    ) : (
      <span className="rounded-full bg-primary-soft px-[11px] py-[6px] text-[11.5px] font-bold text-primary">
        En tournée
      </span>
    )}
    {openDisputesCount > 0 && (
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onOpenDisputes();
        }}
        className="cursor-pointer text-[11px] font-bold text-danger underline-offset-2 hover:underline"
      >
        {openDisputesCount} contestation{openDisputesCount > 1 ? 's' : ''}
      </button>
    )}
  </div>
);
