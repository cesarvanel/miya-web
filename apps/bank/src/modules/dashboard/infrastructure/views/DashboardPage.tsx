import React from 'react';
import { Link } from 'react-router-dom';
import { InitialsAvatar, KpiCard, NotificationBell, Skeleton, Table, Tabs, type TableColumn } from '@miya/ui';
import { Money } from '@miya/kernel';
import { PageShell } from '@/shared/layout/PageShell';
import { AgentDayStatus, type AgentDaySummary } from '../../domain/entities/AgentDaySummary';
import { ActivityFeedItem } from './composants/ActivityFeedItem';
import { AgentStatusCell } from './composants/AgentStatusCell';
import { AlertBanner } from './composants/AlertBanner';
import { CashCell } from './composants/CashCell';
import { ProgressCell } from './composants/ProgressCell';
import { type AgentFilter, useDashboard } from './useDashboard';

const filterTabs: { id: AgentFilter; label: string }[] = [
  { id: 'all', label: 'Tous' },
  { id: 'onRound', label: 'En tournée' },
  { id: 'pending', label: 'À valider' },
];

/** Tableau de bord du responsable — KPIs, alertes, Mes agents, activité en direct. */
export const DashboardPage: React.FC = () => {
  const {
    agents,
    totalAgents,
    kpis,
    alerts,
    activity,
    isPending,
    filter,
    setFilter,
    handleRowClick,
    goToSlip,
    goToDisputes,
    goToRound,
  } = useDashboard();

  const columns: TableColumn<AgentDaySummary>[] = [
    {
      key: 'agent',
      header: 'Agent',
      cell: (row) => (
        <div className="flex min-w-0 items-center gap-[11px]">
          <InitialsAvatar name={row.name} />
          <div className="min-w-0">
            <Link
              to={`/agents/${row.agentId}`}
              onClick={(event) => event.stopPropagation()}
              className="block truncate text-sm font-bold text-ink hover:underline"
            >
              {row.name}
            </Link>
            <div className="text-xs font-medium text-ink-muted">{row.zone}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'progress',
      header: 'Progression',
      cell: (row) => <ProgressCell visited={row.roundProgress.visited} total={row.roundProgress.total} />,
    },
    {
      key: 'collected',
      header: 'Collecté',
      cell: (row) => (
        <span className="num text-[15px] font-bold text-ink">
          {Money.from(row.collectedAmount).format().replace(' FCFA', '')}
        </span>
      ),
    },
    {
      key: 'cash',
      header: 'Cash en main',
      cell: (row) => {
        if (row.status === AgentDayStatus.SettlementPending) {
          return (
            <span className="num text-[12.5px] font-bold text-danger">
              {Money.from(row.collectedAmount).format()} à reverser
            </span>
          );
        }
        if (row.status === AgentDayStatus.Validated) {
          return <span className="num text-[12.5px] font-semibold text-ink-faint">0 · reversé</span>;
        }
        return <CashCell cashInHand={row.cashInHand} cashHoldingCap={row.cashHoldingCap} />;
      },
    },
    {
      key: 'status',
      header: 'Statut',
      cell: (row) => (
        <AgentStatusCell
          status={row.status}
          openDisputesCount={row.openDisputesCount}
          onOpenSlip={() => row.slipId && goToSlip(row.slipId)}
          onOpenDisputes={goToDisputes}
        />
      ),
    },
    {
      key: 'chevron',
      header: '',
      align: 'right',
      cell: () => (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <path d="M7 4l5 5-5 5" stroke="#B9BAB2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
  ];

  return (
    <PageShell
      title="Tableau de bord"
      subtitle="Vue d'ensemble de la journée — Agence Mokolo"
      actions={<NotificationBell variant={kpis.openDisputes > 0 ? 'count' : 'none'} count={kpis.openDisputes} />}
    >
      {isPending && agents.length === 0 ? (
        <div className="grid grid-cols-4 gap-4">
          <Skeleton variant="card" />
          <Skeleton variant="card" />
          <Skeleton variant="card" />
          <Skeleton variant="card" />
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          <KpiCard
            tone="primary"
            label="Total collecté aujourd'hui"
            value={kpis.totalCollectedToday.amount}
            hint={<span className="text-xs font-medium text-primary-tint">FCFA</span>}
          />
          <KpiCard
            label="Cash en circulation"
            value={kpis.cashInCirculation.amount}
            hint={
              <span className="text-xs font-medium text-ink-faint">
                chez <b className="text-ink">{kpis.agentsOnRound.total}</b> agents · FCFA
              </span>
            }
          />
          <KpiCard
            label="Agents en tournée"
            value={kpis.agentsOnRound.on}
            formatter={(value) => `${value}/${kpis.agentsOnRound.total}`}
            hint={
              <span className="text-xs font-medium text-ink-faint">
                <b className="text-primary">{kpis.dayClosedCount}</b> journées clôturées
              </span>
            }
          />
          <KpiCard
            tone={kpis.openDisputes > 0 ? 'danger' : 'default'}
            pulse={kpis.openDisputes > 0}
            label="Contestations ouvertes"
            value={kpis.openDisputes}
            hint={
              <span className="text-xs font-medium text-ink-faint">
                {kpis.openDisputes > 0 ? 'à résoudre ce soir' : 'tout est à jour'}
              </span>
            }
          />
        </div>
      )}

      <div className="mt-[22px] flex items-start gap-5">
        <div className="min-w-0 flex-1 space-y-[18px]">
          {alerts.length > 0 && (
            <div className="flex flex-col gap-[10px]">
              <div className="flex items-center gap-[9px]">
                <span className="text-[13px] font-extrabold tracking-[.03em] text-ink-muted uppercase">
                  Alertes
                </span>
                <span className="h-px flex-1 bg-line-soft" />
              </div>
              {alerts.map((alert) => (
                <AlertBanner
                  key={alert.id}
                  tone={alert.kind === 'settlementOverdue' ? 'danger' : 'amber'}
                  title={alert.message}
                  detail={alert.detail}
                  actionLabel={alert.kind === 'settlementOverdue' ? 'Ouvrir le bordereau' : 'Voir la tournée'}
                  onAction={() => (alert.slipId ? goToSlip(alert.slipId) : goToRound(alert.agentId))}
                />
              ))}
            </div>
          )}

          <div className="overflow-hidden rounded-card-lg border border-line bg-card">
            <div className="flex items-center justify-between px-[22px] pt-[18px] pb-[14px]">
              <div className="text-base font-extrabold text-ink">
                Mes agents <span className="text-[13px] font-semibold text-ink-faint">· {totalAgents}</span>
              </div>
              <Tabs items={filterTabs} activeId={filter} onChange={(id) => setFilter(id as AgentFilter)} />
            </div>
            <Table
              columns={columns}
              rows={agents}
              rowKey={(row) => row.agentId}
              onRowClick={handleRowClick}
            />
          </div>
        </div>

        <div className="w-[360px] flex-none rounded-card-lg border border-line bg-card p-5 pb-2">
          <div className="mb-4 flex items-center gap-[9px]">
            <span className="animate-pulse-soft size-[9px] rounded-full bg-primary" aria-hidden="true" />
            <span className="text-base font-extrabold text-ink">Activité en direct</span>
          </div>
          {activity.length === 0 ? (
            <div className="py-8 text-center text-sm font-medium text-ink-faint">
              Rien pour l'instant.
            </div>
          ) : (
            activity.map((event, index) => (
              <ActivityFeedItem key={event.id} event={event} showConnector={index < activity.length - 1} />
            ))
          )}
          <div className="cursor-pointer border-t border-line-soft py-[14px] text-center text-[13px] font-bold text-primary">
            Voir toute l'activité
          </div>
        </div>
      </div>
    </PageShell>
  );
};
