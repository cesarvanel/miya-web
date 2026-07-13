import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Dropdown, InitialsAvatar, SearchInput, Table, Tabs, type TableColumn } from '@miya/ui';
import { Money } from '@miya/kernel';
import { PageShell } from '@/shared/layout/PageShell';
import type { Client } from '../../../domain/entities/Client';
import { ClientsStatsRow } from '../composants/ClientsStatsRow';
import { ClientStatusChip } from '../composants/ClientStatusChip';
import { RegularityCell } from '../composants/RegularityCell';
import { useClientsList } from './useClientsList';

/** Listing des clients — stats, recherche, filtres, table paginée. Fidèle à la maquette 6a. */
export const ClientsListPage: React.FC = () => {
  const {
    isPending,
    search,
    setSearch,
    zone,
    setZone,
    agentId,
    setAgentId,
    quickFilter,
    setQuickFilter,
    zones,
    agents,
    clients,
    totalFiltered,
    page,
    pageCount,
    setPage,
    totalActiveCount,
    withdrawalPendingCount,
    lowRegularityCount,
    totalSavings,
    averageRegularityRatio,
    goToClient,
    goToNewClient,
  } = useClientsList();

  const columns: TableColumn<Client>[] = [
    {
      key: 'client',
      header: 'Client',
      cell: (client) => (
        <div className="flex min-w-0 items-center gap-2.75">
          <InitialsAvatar name={client.fullName} />
          <div className="min-w-0">
            <div className="truncate text-sm font-bold text-ink">{client.fullName}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'activity',
      header: 'Activité',
      cell: (client) => <span className="text-[12.5px] font-medium text-ink-muted">{client.activity}</span>,
    },
    {
      key: 'zone',
      header: 'Zone',
      cell: (client) => <span className="text-[12.5px] font-medium text-ink-muted">{client.zone}</span>,
    },
    {
      key: 'agent',
      header: 'Agent',
      cell: (client) => (
        <Link
          to={`/agents/${client.assignedAgent.id}`}
          onClick={(event) => event.stopPropagation()}
          className="text-[12.5px] font-medium text-ink-muted hover:underline"
        >
          {client.assignedAgent.name}
        </Link>
      ),
    },
    {
      key: 'regularity',
      header: 'Régul.',
      align: 'right',
      cell: (client) => <RegularityCell regularity={client.regularity} />,
    },
    {
      key: 'balance',
      header: 'Solde',
      align: 'right',
      cell: (client) => (
        <span className="num text-[13.5px] font-bold text-ink">{Money.from(client.savingsBalance).format()}</span>
      ),
    },
    {
      key: 'status',
      header: 'Statut',
      align: 'right',
      cell: (client) => <ClientStatusChip client={client} />,
    },
  ];

  return (
    <PageShell
      title="Clients"
      subtitle={`${totalActiveCount.toLocaleString('fr-FR')} clients actifs · agence Mokolo`}
      actions={
        <>
          <SearchInput value={search} onChange={setSearch} placeholder="Nom, téléphone, ID…" />
          <Button variant="primary" onClick={goToNewClient}>
            + Nouveau client
          </Button>
        </>
      }
    >
      <ClientsStatsRow
        totalActiveCount={totalActiveCount}
        totalSavings={totalSavings}
        averageRegularityRatio={averageRegularityRatio}
        withdrawalPendingCount={withdrawalPendingCount}
      />

      <div className="mb-4 flex items-center gap-2">
        <Tabs
          items={[
            { id: 'all', label: 'Tous', count: totalFiltered },
            { id: 'withdrawalPending', label: 'Retrait en cours', count: withdrawalPendingCount },
            { id: 'lowRegularity', label: 'Régularité faible', count: lowRegularityCount },
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
          <Dropdown
            options={[
              { value: '', label: 'Tous agents' },
              ...agents.map((agent) => ({ value: agent.id, label: agent.name })),
            ]}
            value={agentId}
            onChange={setAgentId}
            aria-label="Filtrer par agent"
          />
        </div>
      </div>

      <Table
        columns={columns}
        rows={clients}
        rowKey={(client) => client.id}
        onRowClick={(client) => goToClient(client.id)}
        pagination={{ page, pageCount, onChange: setPage, totalItems: totalFiltered, itemLabel: 'clients' }}
        emptyState={!isPending ? <div className="py-10 text-center text-sm font-medium text-ink-faint">Aucun client ne correspond à ces filtres.</div> : undefined}
      />
    </PageShell>
  );
};
