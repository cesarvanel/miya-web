import React from 'react';
import { Button, EmptyState, InitialsAvatar, Table, Tabs, type TableColumn } from '@miya/ui';
import { Money } from '@miya/kernel';
import { PageShell } from '@/shared/layout/PageShell';
import type { Withdrawal } from '../../../domain/entities/Withdrawal';
import { WithdrawalStatus } from '../../../domain/entities/Withdrawal';
import { ApproveWithdrawalModal } from '../modal/ApproveWithdrawalModal';
import { DisburseWithdrawalModal } from '../modal/DisburseWithdrawalModal';
import { RejectWithdrawalModal } from '../modal/RejectWithdrawalModal';
import { BalanceCell } from '../composants/BalanceCell';
import { TraceabilityCell } from '../composants/TraceabilityCell';
import { WithdrawalsStatsRow } from '../composants/WithdrawalsStatsRow';
import { formatAge, formatShortDate, formatTime } from '../composants/formatWithdrawalTime';
import { useWithdrawalsQueue } from './useWithdrawalsQueue';

const ClientCell: React.FC<{ withdrawal: Withdrawal }> = ({ withdrawal }) => (
  <div className="flex min-w-0 items-center gap-2.75">
    <InitialsAvatar name={withdrawal.client.name} />
    <div className="min-w-0">
      <div className="truncate text-sm font-bold text-ink">{withdrawal.client.name}</div>
      <div className="truncate text-[11.5px] font-medium text-ink-faint">{withdrawal.client.activity}</div>
    </div>
  </div>
);

const AmountCell: React.FC<{ amount: number }> = ({ amount }) => (
  <span className="num text-[17px] font-bold text-ink">{Money.from(amount).format()}</span>
);

/** File des retraits — À traiter / À décaisser / Historique. Fidèle à la maquette 5/5a. */
export const WithdrawalsPage: React.FC = () => {
  const {
    tab,
    setTab,
    isPending,
    pendingWithdrawals,
    approvedWithdrawals,
    historyList,
    totalPendingAmount,
    totalApprovedAmount,
    disbursedThisMonthAmount,
    rejectedCount,
    highlightId,
    openApprove,
    openReject,
    openDisburse,
  } = useWithdrawalsQueue();

  const pendingColumns: TableColumn<Withdrawal>[] = [
    { key: 'client', header: 'Client', cell: (w) => <ClientCell withdrawal={w} /> },
    { key: 'amount', header: 'Montant demandé', align: 'right', cell: (w) => <AmountCell amount={w.requestedAmount} /> },
    {
      key: 'balance',
      header: 'Solde disponible',
      align: 'right',
      cell: (w) => <BalanceCell availableBalance={w.availableBalance} requestedAmount={w.requestedAmount} />,
    },
    {
      key: 'requestedAt',
      header: 'Demandé',
      cell: (w) => (
        <div className="text-[12px] font-semibold text-ink-muted">
          {formatShortDate(w.requestedAt)} · {formatAge(w.requestedAt)}
        </div>
      ),
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      cell: (w) => (
        <div className="flex justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={() => openReject(w.id)}>
            Refuser
          </Button>
          <Button variant="primary" size="sm" onClick={() => openApprove(w.id)}>
            Valider
          </Button>
        </div>
      ),
    },
  ];

  const approvedColumns: TableColumn<Withdrawal>[] = [
    { key: 'client', header: 'Client', cell: (w) => <ClientCell withdrawal={w} /> },
    { key: 'amount', header: 'Montant demandé', align: 'right', cell: (w) => <AmountCell amount={w.requestedAmount} /> },
    {
      key: 'balance',
      header: 'Solde disponible',
      align: 'right',
      cell: (w) => <BalanceCell availableBalance={w.availableBalance} requestedAmount={w.requestedAmount} />,
    },
    {
      key: 'approval',
      header: 'Validé',
      cell: (w) => (
        <div className="text-[12px] font-semibold text-ink-muted">
          {w.approval ? `${w.approval.by} · ${formatTime(w.approval.at)}` : '—'}
        </div>
      ),
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      cell: (w) => (
        <Button variant="primary" size="sm" onClick={() => openDisburse(w.id)}>
          Décaisser
        </Button>
      ),
    },
  ];

  const historyColumns: TableColumn<Withdrawal>[] = [
    { key: 'client', header: 'Client', cell: (w) => <ClientCell withdrawal={w} /> },
    { key: 'amount', header: 'Montant', align: 'right', cell: (w) => <AmountCell amount={w.requestedAmount} /> },
    {
      key: 'status',
      header: 'Statut',
      cell: (w) => (
        <span
          className={[
            'w-fit rounded-full px-[10px] py-1 text-[11px] font-bold whitespace-nowrap',
            w.status === WithdrawalStatus.Disbursed ? 'bg-primary-soft text-primary' : 'bg-danger-soft text-danger',
          ].join(' ')}
        >
          {w.status === WithdrawalStatus.Disbursed ? 'Décaissé' : 'Refusé'}
        </span>
      ),
    },
    { key: 'trace', header: 'Traçabilité', cell: (w) => <TraceabilityCell withdrawal={w} /> },
  ];

  return (
    <PageShell
      title="Retraits"
      subtitle="Demande → validation → décaissement en agence"
    >
      <WithdrawalsStatsRow
        pendingCount={pendingWithdrawals.length}
        totalPendingAmount={totalPendingAmount}
        approvedCount={approvedWithdrawals.length}
        totalApprovedAmount={totalApprovedAmount}
        disbursedThisMonthAmount={disbursedThisMonthAmount}
        rejectedCount={rejectedCount}
      />

      <div className="mb-4 flex items-center gap-2">
        <Tabs
          items={[
            { id: 'pending', label: 'À traiter', count: pendingWithdrawals.length },
            { id: 'approved', label: 'À décaisser', count: approvedWithdrawals.length },
            { id: 'history', label: 'Historique', count: historyList.length },
          ]}
          activeId={tab}
          onChange={(id) => setTab(id as typeof tab)}
        />
        {tab === 'pending' && pendingWithdrawals.length > 0 && (
          <div className="ml-auto rounded-tile flex items-center gap-2 bg-cream-100 px-3.25 py-2 text-[12.5px] font-semibold text-ink-muted">
            Total demandé
            <span className="num font-bold text-ink">{Money.from(totalPendingAmount).format()}</span>
          </div>
        )}
      </div>

      {tab === 'pending' && (
        <Table
          columns={pendingColumns}
          rows={pendingWithdrawals}
          rowKey={(w) => w.id}
          selectedRowKey={highlightId}
          emptyState={
            !isPending ? (
              <EmptyState title="Aucune demande à traiter" description="Les nouvelles demandes de retrait apparaîtront ici." />
            ) : undefined
          }
        />
      )}
      {tab === 'approved' && (
        <Table
          columns={approvedColumns}
          rows={approvedWithdrawals}
          rowKey={(w) => w.id}
          selectedRowKey={highlightId}
          emptyState={
            !isPending ? (
              <EmptyState title="Rien à décaisser" description="Les demandes validées en attente de remise apparaîtront ici." />
            ) : undefined
          }
        />
      )}
      {tab === 'history' && (
        <Table
          columns={historyColumns}
          rows={historyList}
          rowKey={(w) => w.id}
          selectedRowKey={highlightId}
          emptyState={
            !isPending ? (
              <EmptyState title="Aucun historique" description="Les retraits décaissés ou refusés apparaîtront ici." />
            ) : undefined
          }
        />
      )}

      <ApproveWithdrawalModal />
      <RejectWithdrawalModal />
      <DisburseWithdrawalModal />
    </PageShell>
  );
};
