import React from 'react';
import { Button, Dropdown, InitialsAvatar, SearchInput, Table, Tabs, type TableColumn } from '@miya/ui';
import { PageShell } from '@/shared/layout/PageShell';
import type { Agent } from '../../../domain/entities/Agent';
import { AgentsStatsRow } from '../composants/AgentsStatsRow';
import { AgentStatusChip } from '../composants/AgentStatusChip';
import { DeviceCell } from '../composants/DeviceCell';
import { MonthStatsCell } from '../composants/MonthStatsCell';
import { RoleBadge } from '../composants/RoleBadge';
import { useAgentsList } from './useAgentsList';

/** Listing des agents & responsables — stats, filtres, table paginée. Fidèle à la maquette 7a. */
export const AgentsListPage: React.FC = () => {
  const {
    isPending,
    search,
    setSearch,
    zone,
    setZone,
    zones,
    quickFilter,
    setQuickFilter,
    agents,
    totalFiltered,
    page,
    pageCount,
    setPage,
    totalCount,
    collectorsCount,
    supervisorsCount,
    revokedDeviceCount,
    activeCount,
    totalCollected,
    averageConfirmationRate,
    goToAgent,
    goToNewAgent,
  } = useAgentsList();

  const columns: TableColumn<Agent>[] = [
    {
      key: 'agent',
      header: 'Agent',
      cell: (agent) => (
        <div className="flex min-w-0 items-center gap-2.75">
          <InitialsAvatar name={agent.fullName} />
          <div className="min-w-0">
            <div className="truncate text-sm font-bold text-ink">{agent.fullName}</div>
            <div className="num text-[11.5px] font-medium text-ink-faint">{agent.registrationNumber}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Rôle',
      cell: (agent) => <RoleBadge role={agent.role} />,
    },
    {
      key: 'zone',
      header: 'Zone',
      cell: (agent) => <span className="text-[12.5px] font-medium text-ink-muted">{agent.zones.join(', ')}</span>,
    },
    {
      key: 'supervisor',
      header: 'Responsable',
      cell: (agent) => (
        <span className="text-[12.5px] font-medium text-ink-muted">{agent.supervisor?.name ?? '—'}</span>
      ),
    },
    {
      key: 'device',
      header: 'Appareil',
      cell: (agent) => <DeviceCell agent={agent} />,
    },
    {
      key: 'monthStats',
      header: 'Ce mois',
      align: 'right',
      cell: (agent) => <MonthStatsCell stats={agent.monthStats} />,
    },
    {
      key: 'status',
      header: 'Statut',
      align: 'right',
      cell: (agent) => <AgentStatusChip status={agent.status} />,
    },
  ];

  return (
    <PageShell
      title="Agents & responsables"
      subtitle={`${totalCount} membres · ${collectorsCount} agents · ${supervisorsCount} responsables · agence Mokolo`}
      actions={
        <>
          <SearchInput value={search} onChange={setSearch} placeholder="Nom, matricule…" />
          <Button variant="primary" onClick={goToNewAgent}>
            + Créer un agent
          </Button>
        </>
      }
    >
      <AgentsStatsRow
        activeCount={activeCount}
        totalCount={totalCount}
        totalCollected={totalCollected}
        averageConfirmationRate={averageConfirmationRate}
        devicesToReactivateCount={revokedDeviceCount}
      />

      <div className="mb-4 flex items-center gap-2">
        <Tabs
          items={[
            { id: 'all', label: 'Tous', count: totalCount },
            { id: 'collectors', label: 'Agents', count: collectorsCount },
            { id: 'supervisors', label: 'Responsables', count: supervisorsCount },
            { id: 'revokedDevice', label: 'Appareil révoqué', count: revokedDeviceCount },
          ]}
          activeId={quickFilter}
          onChange={(id) => setQuickFilter(id as typeof quickFilter)}
        />
        <div className="ml-auto flex items-center gap-2">
          <Dropdown
            options={[{ value: '', label: 'Toutes zones' }, ...zones.map((z) => ({ value: z, label: z }))]}
            value={zone}
            onChange={setZone}
            aria-label="Filtrer par zone"
          />
        </div>
      </div>

      <Table
        columns={columns}
        rows={agents}
        rowKey={(agent) => agent.id}
        onRowClick={(agent) => goToAgent(agent.id)}
        pagination={{ page, pageCount, onChange: setPage, totalItems: totalFiltered, itemLabel: 'membres' }}
        emptyState={!isPending ? <div className="py-10 text-center text-sm font-medium text-ink-faint">Aucun membre ne correspond à ces filtres.</div> : undefined}
      />
    </PageShell>
  );
};
