import React from 'react';
import { InitialsAvatar } from '@miya/ui';
import type { AgentRanking } from '../../../domain/entities/Supervision';

interface AgentRankingListProps {
  title: string;
  ranking: AgentRanking[];
}

const fcfa = (amount: number): string => `${amount.toLocaleString('fr-FR')} FCFA`;

/** Classement des agents — maquette 10a/10b. */
export const AgentRankingList: React.FC<AgentRankingListProps> = ({ title, ranking }) => (
  <div className="rounded-card-lg border border-line bg-card p-5">
    <div className="mb-3.5 text-[15px] font-extrabold text-ink">{title}</div>
    <div className="flex flex-col gap-2.5">
      {ranking.map((entry, index) => (
        <div key={entry.agentId} className="flex items-center gap-3">
          <span className="num flex size-6 flex-none items-center justify-center rounded-lg bg-cream-100 text-[12px] font-bold text-ink-muted">
            {index + 1}
          </span>
          <InitialsAvatar name={entry.agentName} size="sm" />
          <div className="min-w-0 flex-1">
            <div className="truncate text-[13px] font-bold text-ink">{entry.agentName}</div>
            <div className="text-[11.5px] font-medium text-ink-faint">{entry.agencyName} · {entry.regularityRate}%</div>
          </div>
          <span className="num flex-none text-[13px] font-bold text-ink">{fcfa(entry.amount)}</span>
        </div>
      ))}
    </div>
  </div>
);
