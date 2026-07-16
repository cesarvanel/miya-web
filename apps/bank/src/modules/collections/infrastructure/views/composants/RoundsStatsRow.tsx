import React from 'react';
import { CountUp } from '@miya/ui';
import { Money } from '@miya/kernel';
import type { RoundsSummary } from '../../../domain/selectors/Selectors';

interface RoundsStatsRowProps {
  summary: RoundsSummary;
}

/** Bandeau de stats du listing — fidèle à la maquette 4a (4 tuiles). */
export const RoundsStatsRow: React.FC<RoundsStatsRowProps> = ({ summary }) => (
  <div className="mb-5 grid grid-cols-4 gap-4">
    <div className="rounded-card-lg shadow-primary-glow bg-primary p-[18px] text-white">
      <div className="text-primary-tint text-[12.5px] font-semibold">En tournée</div>
      <div className="mt-2 text-[30px] font-bold">
        <CountUp value={summary.openCount} className="text-white" />
        <span className="num text-primary-tint text-[20px]">/{summary.totalCount}</span>
      </div>
      <div className="text-primary-tint mt-1 text-[11.5px] font-medium">
        {summary.closedCount} journée{summary.closedCount > 1 ? 's' : ''} clôturée
        {summary.closedCount > 1 ? 's' : ''}
      </div>
    </div>
    <div className="rounded-card-lg border border-line bg-card p-[18px]">
      <div className="text-[12.5px] font-semibold text-ink-muted">Collecté en direct</div>
      <div className="mt-2 text-[30px] font-bold text-ink">
        <CountUp value={summary.collectedTotal} formatter={(v) => Money.from(v).format().replace(' FCFA', '')} />
      </div>
      <div className="mt-1 text-[11.5px] font-medium text-ink-faint">FCFA · aujourd'hui</div>
    </div>
    <div className="rounded-card-lg border border-line bg-card p-[18px]">
      <div className="text-[12.5px] font-semibold text-ink-muted">Progression moyenne</div>
      <div className="mt-2 text-[30px] font-bold text-ink">
        <CountUp value={Math.round(summary.averageProgressRatio * 100)} />
        <span className="num text-[18px] text-ink-disabled">%</span>
      </div>
      <div className="mt-1 text-[11.5px] font-medium text-ink-faint">des clients visités</div>
    </div>
    <div
      className={[
        'rounded-card-lg p-[18px]',
        summary.capAlert ? 'border-[1.5px] border-amber-border bg-card' : 'border border-line bg-card',
      ].join(' ')}
    >
      <div className={['text-[12.5px] font-semibold', summary.capAlert ? 'text-amber' : 'text-ink-muted'].join(' ')}>
        Alerte plafond
      </div>
      <div className={['num mt-2 text-[30px] font-bold', summary.capAlert ? 'text-amber' : 'text-ink'].join(' ')}>
        {summary.capAlert ? 1 : 0}
      </div>
      <div className={['mt-1 text-[11.5px] font-medium', summary.capAlert ? 'text-amber-deep' : 'text-ink-faint'].join(' ')}>
        {summary.capAlert
          ? `${summary.capAlert.agentName} · ${Math.round(summary.capAlert.ratio * 100)}%`
          : 'aucun agent proche du plafond'}
      </div>
    </div>
  </div>
);
