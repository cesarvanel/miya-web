import React, { useLayoutEffect, useRef, useState } from 'react';
import { KpiCard } from '@miya/ui';
import { AdminShell } from '@/shared/layout/AdminShell';
import { AgencyBreakdownList } from '../composants/AgencyBreakdownList';
import { AgentRankingList } from '../composants/AgentRankingList';
import { AttentionPointsGrid } from '../composants/AttentionPointsGrid';
import { ReconciliationList } from '../composants/ReconciliationList';
import { TrendChart } from '../composants/TrendChart';
import { useSupervisionPage, type SupervisionPeriod } from './useSupervisionPage';

const fcfa = (amount: number): string => `${amount.toLocaleString('fr-FR')} FCFA`;
const million = (amount: number): string => `${(amount / 1_000_000).toLocaleString('fr-FR', { maximumFractionDigits: 1 })} M`;

const PERIODS: { id: SupervisionPeriod; label: string }[] = [
  { id: 'day', label: 'Jour' },
  { id: 'month', label: 'Mois' },
];

/** Tableau de bord global — vue consolidée toutes agences. Maquette 10a/10b. */
export const SupervisionPage: React.FC = () => {
  const {
    period,
    setPeriod,
    day,
    month,
    disputesCount,
    openDisputesCount,
    resolvedDisputesCount,
    averageRegularityRate,
    newClientsThisMonth,
  } = useSupervisionPage();

  const periodButtonsRef = useRef<Map<SupervisionPeriod, HTMLButtonElement>>(new Map());
  const [periodPill, setPeriodPill] = useState<{ left: number; width: number } | null>(null);

  useLayoutEffect(() => {
    const activeButton = periodButtonsRef.current.get(period);
    if (activeButton) {
      setPeriodPill({ left: activeButton.offsetLeft, width: activeButton.offsetWidth });
    }
  }, [period]);

  const contentKey = `${period}-${(period === 'day' ? day : month) ? 'ready' : 'loading'}`;

  return (
    <AdminShell
      breadcrumb={[{ label: 'Administration', to: '/admin' }, { label: 'Supervision' }]}
      title="Supervision"
      subtitle="Vue consolidée · toutes agences"
      actions={
        <div className="relative flex items-center gap-1 rounded-xl bg-cream-100 p-1">
          {periodPill && (
            <div
              aria-hidden="true"
              className="shadow-primary-glow bg-primary absolute top-1 h-[calc(100%-8px)] rounded-lg transition-[left,width] duration-250 ease-out"
              style={{ left: periodPill.left, width: periodPill.width }}
            />
          )}
          {PERIODS.map((item) => (
            <button
              key={item.id}
              ref={(el) => {
                if (el) {
                  periodButtonsRef.current.set(item.id, el);
                } else {
                  periodButtonsRef.current.delete(item.id);
                }
              }}
              type="button"
              onClick={() => setPeriod(item.id)}
              className={[
                'relative z-10 cursor-pointer rounded-lg px-3.5 py-1.5 text-[12.5px] font-bold transition-colors duration-200',
                period === item.id ? 'text-white' : 'text-ink-muted hover:bg-cream-50',
              ].join(' ')}
            >
              {item.label}
            </button>
          ))}
        </div>
      }
    >
      <div key={contentKey} className="animate-fade-in">
        {period === 'day' ? (
          day ? (
            <div className="flex flex-col gap-5">
              <div className="grid grid-cols-4 gap-4">
                <KpiCard tone="primary" label="Collecté aujourd'hui" value={day.collectedToday} formatter={million} hint={`+${day.collectedTodayDeltaPct}% vs hier`} />
                <KpiCard label="Reversé & rapproché" value={day.reconciledRate} formatter={(v) => `${v}%`} hint={`${day.reconciledCount}/${day.reconciledTotal} bordereaux`} />
                <KpiCard label="Contestations" value={disputesCount} hint={`${resolvedDisputesCount} résolues · ${openDisputesCount} ouvertes`} />
                <KpiCard tone="danger" label="Écarts de caisse" value={day.cashGapAmount} formatter={fcfa} hint={`${day.cashGapRejections} rejet${day.cashGapRejections > 1 ? 's' : ''}`} />
              </div>
              <div className="grid grid-cols-[1.3fr_1fr] gap-5">
                <ReconciliationList reconciliations={day.reconciliations} />
                <AgentRankingList title="Classement des agents" ranking={day.ranking} />
              </div>
              <AttentionPointsGrid points={day.attentionPoints} />
            </div>
          ) : (
            <div className="py-10 text-center text-sm font-medium text-ink-faint">Chargement…</div>
          )
        ) : month ? (
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-4 gap-4">
              <KpiCard tone="primary" label={`Collecté en ${month.monthLabel.split(' ')[0].toLowerCase()}`} value={month.collectedMonth} formatter={million} hint={`+${month.collectedMonthDeltaPct}% vs mois précédent`} />
              <KpiCard label="Taux de reversement" value={month.settlementRate * 10} formatter={(v) => `${(v / 10).toFixed(1).replace('.', ',')}%`} />
              <KpiCard label="Régularité moyenne" value={averageRegularityRate} formatter={(v) => `${v}%`} hint="tous clients" />
              <KpiCard label="Nouveaux clients" value={newClientsThisMonth} formatter={(v) => `+${v}`} hint="mois en cours" />
            </div>
            <TrendChart title={`Collecte quotidienne · ${month.monthLabel}`} points={month.trend} average={month.trendAverage} />
            <div className="grid grid-cols-[1.3fr_1fr] gap-5">
              <AgencyBreakdownList breakdown={month.breakdown} />
              <AgentRankingList title="Meilleurs agents du mois" ranking={month.topAgents} />
            </div>
          </div>
        ) : (
          <div className="py-10 text-center text-sm font-medium text-ink-faint">Chargement…</div>
        )}
      </div>
    </AdminShell>
  );
};
