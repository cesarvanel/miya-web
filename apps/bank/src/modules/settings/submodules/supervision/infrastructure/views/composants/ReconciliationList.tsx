import React from 'react';
import { ProgressBar } from '@miya/ui';
import type { AgencyReconciliation } from '../../../domain/entities/Supervision';

interface ReconciliationListProps {
  reconciliations: AgencyReconciliation[];
}

const fcfa = (amount: number): string => `${amount.toLocaleString('fr-FR')} FCFA`;

/** Rapprochements du jour par agence — maquette 10a. */
export const ReconciliationList: React.FC<ReconciliationListProps> = ({ reconciliations }) => (
  <div className="rounded-card-lg border border-line bg-card p-5">
    <div className="mb-3.5 text-[15px] font-extrabold text-ink">Rapprochements du jour</div>
    <div className="flex flex-col gap-3.5">
      {reconciliations.map((entry, index) => (
        <div key={entry.agencyId} className="animate-stagger-in" style={{ animationDelay: `${index * 40}ms` }}>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[13.5px] font-bold text-ink">Agence {entry.agencyName}</div>
              <div className="text-[11.5px] font-medium text-ink-faint">Responsable {entry.managerName}</div>
            </div>
            <div className="text-right">
              <div className="num text-[13.5px] font-bold text-ink">{fcfa(entry.amount)}</div>
              <div className="num text-[12px] font-bold text-primary">{entry.rate}%</div>
            </div>
          </div>
          <ProgressBar mode="determinate" value={entry.rate} className="mt-2" />
        </div>
      ))}
    </div>
  </div>
);
