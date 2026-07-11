import React from 'react';
import { Button, EmptyState, Table, Tabs, type TableColumn } from '@miya/ui';
import { PageShell } from '@/shared/layout/PageShell';
import type { Dispute } from '../../../domain/entities/Dispute';
import { selectDisputeGap } from '../../../domain/selectors/Selectors';
import { AmountFaceoffCell } from '../composants/AmountFaceoffCell';
import { DisputeStatusChip } from '../composants/DisputeStatusChip';
import { formatTime } from '../composants/formatDisputeTime';
import { formatSignedGap } from '../composants/formatAmount';
import { PartyCell } from '../composants/PartyCell';
import { useDisputesList } from './useDisputesList';

/** Listing des contestations — onglets Ouvertes/Résolues, fidèle à la maquette 3a. */
export const DisputesListPage: React.FC = () => {
  const { tab, setTab, openDisputes, resolvedDisputes, disputes, isPending, goToResolution } =
    useDisputesList();

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
      cell: (dispute) => <PartyCell name={dispute.client.name} />,
    },
    {
      key: 'agent',
      header: 'Agent',
      cell: (dispute) => <PartyCell name={dispute.agent.name} muted />,
    },
    {
      key: 'amounts',
      header: 'Saisi vs déclaré',
      cell: (dispute) => (
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
        <span className="num text-sm font-bold text-danger">
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
          <Button
            size="sm"
            variant="destructive"
            onClick={() => goToResolution(dispute.id)}
          >
            Résoudre
          </Button>
        ) : (
          <div className="text-[12px] font-semibold text-ink-faint">
            Tranchée par {dispute.resolution?.decidedBy}
          </div>
        ),
    },
  ];

  return (
    <PageShell
      title="Contestations"
      subtitle="À trancher en présence de l'agent, au reversement."
    >
      <div className="mb-4 flex items-center gap-2">
        <Tabs
          items={[
            { id: 'open', label: 'Ouvertes', count: openDisputes.length },
            { id: 'resolved', label: 'Résolues', count: resolvedDisputes.length },
          ]}
          activeId={tab}
          onChange={(id) => setTab(id as 'open' | 'resolved')}
        />
      </div>

      <Table
        columns={columns}
        rows={disputes}
        rowKey={(dispute) => dispute.id}
        onRowClick={(dispute) => goToResolution(dispute.id)}
        emptyState={
          !isPending ? (
            <EmptyState
              title={tab === 'open' ? 'Aucune contestation ouverte' : 'Aucune contestation résolue'}
              description={
                tab === 'open'
                  ? 'Tout est réglé pour le moment.'
                  : "Les décisions prises aujourd'hui apparaîtront ici."
              }
            />
          ) : undefined
        }
      />
    </PageShell>
  );
};
