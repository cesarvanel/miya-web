import React from 'react';
import { Button, EmptyState, Table, Tabs, type TableColumn } from '@miya/ui';
import { PageShell } from '@/shared/layout/PageShell';
import { DisputeStatus, type Dispute } from '../../../domain/entities/Dispute';
import { selectDisputeGap, selectResolutionDelayMinutes } from '../../../domain/selectors/Selectors';
import { AmountFaceoffCell } from '../composants/AmountFaceoffCell';
import { DisputeStatsRow } from '../composants/DisputeStatsRow';
import { DisputeStatusChip } from '../composants/DisputeStatusChip';
import { formatTime } from '../composants/formatDisputeTime';
import { formatSignedGap } from '../composants/formatAmount';
import { PartyCell } from '../composants/PartyCell';
import { ResolvedAmountCell } from '../composants/ResolvedAmountCell';
import { useDisputesList } from './useDisputesList';

/** Listing des contestations — onglets Ouvertes/Résolues/Toutes, fidèle à la maquette 3a. */
export const DisputesListPage: React.FC = () => {
  const {
    tab,
    setTab,
    openDisputes,
    resolvedDisputes,
    isPending,
    goToResolution,
    agentFilter,
    agentFilterName,
    clearAgentFilter,
  } = useDisputesList();

  const columns: TableColumn<Dispute>[] = [
    {
      key: 'reference',
      header: 'Référence',
      cell: (dispute) => (
        <div>
          <div className="num text-[13px] font-bold text-ink">{dispute.id}</div>
          <div className="num text-[11.5px] font-semibold text-ink-faint">
            {formatTime(dispute.openedAt)} · {dispute.zone}
          </div>
        </div>
      ),
    },
    {
      key: 'client',
      header: 'Client',
      cell: (dispute) => <PartyCell name={dispute.client.name} to={`/clients/${dispute.client.id}`} />,
    },
    {
      key: 'agent',
      header: 'Agent',
      cell: (dispute) => <PartyCell name={dispute.agent.name} to={`/agents/${dispute.agent.id}`} muted />,
    },
    {
      key: 'amounts',
      header: 'Saisi vs déclaré',
      cell: (dispute) =>
        dispute.status === DisputeStatus.Resolved && dispute.resolution ? (
          <ResolvedAmountCell
            enteredAmount={dispute.agent.enteredAmount}
            declaredAmount={dispute.client.declaredAmount}
            decidedInFavorOf={dispute.resolution.decidedInFavorOf}
          />
        ) : (
          <AmountFaceoffCell
            enteredAmount={dispute.agent.enteredAmount}
            declaredAmount={dispute.client.declaredAmount}
          />
        ),
    },
    {
      key: 'gap',
      header: 'Écart',
      align: 'right',
      cell: (dispute) => (
        <span
          className={[
            'num text-sm font-bold',
            dispute.status === DisputeStatus.Resolved ? 'text-ink-faint' : 'text-danger',
          ].join(' ')}
        >
          {formatSignedGap(selectDisputeGap(dispute))}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Statut',
      align: 'right',
      cell: (dispute) => <DisputeStatusChip decidedInFavorOf={dispute.resolution?.decidedInFavorOf} />,
    },
    {
      key: 'action',
      header: '',
      align: 'right',
      cell: (dispute) =>
        dispute.status === 'Open' ? (
          <Button size="sm" variant="destructive" onClick={() => goToResolution(dispute.id)}>
            Résoudre
          </Button>
        ) : (
          <div className="text-[12px] font-semibold text-ink-faint">
            Tranchée par {dispute.resolution?.decidedBy}
          </div>
        ),
    },
  ];

  const openGapTotal = openDisputes.reduce(
    (total, dispute) => total + Math.abs(selectDisputeGap(dispute)),
    0,
  );
  const resolutionDelays = resolvedDisputes
    .map((dispute) => selectResolutionDelayMinutes(dispute))
    .filter((delay): delay is number => delay !== null);
  const averageDelayMinutes =
    resolutionDelays.length > 0
      ? Math.round(resolutionDelays.reduce((total, delay) => total + delay, 0) / resolutionDelays.length)
      : null;

  const showOpen = tab === 'open' || tab === 'all';
  const showResolved = tab === 'resolved' || tab === 'all';

  return (
    <PageShell title="Contestations" subtitle="À trancher en présence de l'agent, au reversement.">
      <DisputeStatsRow
        openCount={openDisputes.length}
        resolvedCount={resolvedDisputes.length}
        averageDelayMinutes={averageDelayMinutes}
        openGapTotal={openGapTotal}
      />

      <div className="mb-4 flex items-center gap-2">
        <Tabs
          items={[
            { id: 'open', label: 'Ouvertes', count: openDisputes.length },
            { id: 'resolved', label: 'Résolues', count: resolvedDisputes.length },
            { id: 'all', label: 'Toutes' },
          ]}
          activeId={tab}
          onChange={(id) => setTab(id as 'open' | 'resolved' | 'all')}
        />
        {agentFilter && (
          <span className="flex items-center gap-2 rounded-full bg-primary-soft px-[13px] py-2 text-[12.5px] font-bold text-primary">
            Filtré sur {agentFilterName ?? agentFilter}
            <button type="button" onClick={clearAgentFilter} className="cursor-pointer hover:underline">
              Tout voir
            </button>
          </span>
        )}
      </div>

      {showOpen && (
        <Table
          columns={columns}
          rows={openDisputes}
          rowKey={(dispute) => dispute.id}
          onRowClick={(dispute) => goToResolution(dispute.id)}
          emptyState={
            !isPending ? (
              <EmptyState title="Aucune contestation ouverte" description="Tout est réglé pour le moment." />
            ) : undefined
          }
        />
      )}

      {showResolved && resolvedDisputes.length > 0 && (
        <div className={showOpen ? 'mt-5' : ''}>
          {showOpen && (
            <div className="mb-2.5 px-1 text-[11.5px] font-bold tracking-[.04em] text-ink-faint uppercase">
              Résolues aujourd'hui
            </div>
          )}
          <Table
            columns={columns}
            rows={resolvedDisputes}
            rowKey={(dispute) => dispute.id}
            onRowClick={(dispute) => goToResolution(dispute.id)}
          />
        </div>
      )}

      {showResolved && !showOpen && resolvedDisputes.length === 0 && !isPending && (
        <EmptyState
          title="Aucune contestation résolue"
          description="Les décisions prises aujourd'hui apparaîtront ici."
        />
      )}
    </PageShell>
  );
};
