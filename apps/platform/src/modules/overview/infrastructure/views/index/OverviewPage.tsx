import React from 'react';
import { BarChart, KpiCard, Skeleton } from '@miya/ui';
import { PageShell } from '@/shared/layout/PageShell';
import { AlertsColumn } from '../composants/AlertsColumn';
import { HeroVolumeCard } from '../composants/HeroVolumeCard';
import { TopBanksList } from '../composants/TopBanksList';
import { useOverviewPage } from './useOverviewPage';

/** Tableau de bord global de la console éditeur — maquette 1a. */
export const OverviewPage: React.FC = () => {
  const { period, setPeriod, kpis, volumeSeries, topBanks, alerts } = useOverviewPage();

  if (!kpis) {
    return (
      <PageShell title="Vue d'ensemble" subtitle="Chargement…">
        <div className="grid grid-cols-5 gap-3.5">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} variant="card" />
          ))}
        </div>
        <div className="mt-5 flex gap-5">
          <Skeleton variant="chart" className="flex-1" />
          <Skeleton variant="card" className="w-90 flex-none" />
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell
      title="Vue d'ensemble"
      subtitle={`${kpis.totalBanks} banques clientes · rôle Super admin`}
    >
      <div className="grid grid-cols-5 gap-3.5">
        <HeroVolumeCard kpis={kpis} period={period} onPeriodChange={setPeriod} />
        <KpiCard
          label="Banques actives"
          value={kpis.activeBanks}
          hint={<span className="text-ink-faint"><b className="text-admin-primary">+{kpis.newBanksThisMonth}</b> ce mois · <b>{kpis.trialBanks}</b> en essai</span>}
        />
        <KpiCard
          label="Clients cotisants"
          value={kpis.totalClients}
          hint={<span className="text-ink-faint"><b className="text-admin-primary">▲ +{kpis.clientsDeltaThirtyDays.toLocaleString('fr-FR')}</b> · 30j</span>}
        />
        <KpiCard
          label="Agents actifs"
          value={kpis.totalAgents}
          hint={<span className="text-ink-faint"><b className="text-ink">{kpis.agentsActiveToday}</b> en tournée aujourd&rsquo;hui</span>}
        />
        <KpiCard
          label="MRR abonnements"
          value={kpis.mrr}
          formatter={(v) => `${(v / 1_000_000).toLocaleString('fr-FR', { maximumFractionDigits: 2 })} M`}
          hint={<span className="text-admin-primary">▲ +{kpis.mrrGrowthPct.toFixed(1).replace('.', ',')}% · FCFA</span>}
        />
      </div>

      <div className="mt-5 flex items-start gap-5">
        <div className="flex min-w-0 flex-1 flex-col gap-4.5">
          <div className="rounded-card-lg border border-line bg-card p-[22px_24px_18px]">
            <div className="mb-5 flex items-start justify-between">
              <div>
                <div className="text-[16px] font-extrabold text-ink">Croissance du volume collecté</div>
                <div className="mt-0.5 text-[12.5px] font-medium text-ink-faint">6 derniers mois · toutes banques · FCFA</div>
              </div>
              <div className="text-right">
                <div className="num text-[20px] font-bold text-ink">
                  +{Math.round(((volumeSeries[volumeSeries.length - 1].volumeMd - volumeSeries[0].volumeMd) / volumeSeries[0].volumeMd) * 100)}%
                </div>
                <div className="text-[11.5px] font-semibold text-admin-primary">vs {volumeSeries[0].monthLabel.toLowerCase()}</div>
              </div>
            </div>
            <BarChart points={volumeSeries.map((point) => ({ label: point.monthLabel, value: point.volumeMd }))} formatValue={(v) => v.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} />
          </div>

          <TopBanksList banks={topBanks} />
        </div>

        <AlertsColumn alerts={alerts} />
      </div>
    </PageShell>
  );
};
