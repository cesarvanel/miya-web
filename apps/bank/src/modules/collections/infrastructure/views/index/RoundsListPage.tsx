import React from 'react';
import { Link } from 'react-router-dom';
import { InitialsAvatar, Table, type TableColumn } from '@miya/ui';
import { Money } from '@miya/kernel';
import { PageShell } from '@/shared/layout/PageShell';
import type { CollectionRound } from '../../../domain/entities/CollectionRound';
import { CashGaugeCell } from '../composants/CashGaugeCell';
import { RoundProgressCell } from '../composants/RoundProgressCell';
import { RoundsStatsRow } from '../composants/RoundsStatsRow';
import { RoundStatusChip } from '../composants/RoundStatusChip';
import { useRoundsList } from './useRoundsList';

/** Listing des tournées du jour — suivi temps réel, fidèle à la maquette 4a. */
export const RoundsListPage: React.FC = () => {
  const { rounds, summary, goToRound } = useRoundsList();

  const columns: TableColumn<CollectionRound>[] = [
    {
      key: 'agent',
      header: 'Agent',
      cell: (round) => (
        <div className="flex min-w-0 items-center gap-2.75">
          <InitialsAvatar name={round.agent.name} />
          <div className="min-w-0">
            <Link
              to={`/agents/${round.agent.id}`}
              onClick={(event) => event.stopPropagation()}
              className="block truncate text-sm font-bold text-ink hover:underline"
            >
              {round.agent.name}
            </Link>
          </div>
        </div>
      ),
    },
    {
      key: 'zone',
      header: 'Zone · départ',
      cell: (round) => (
        <div>
          <div className="text-[13px] font-semibold text-ink">{round.zone}</div>
          <div className="num text-[11.5px] font-medium text-ink-faint">
            {round.startedAt}
            {round.endedAt ? ` · fin ${round.endedAt}` : ''}
          </div>
        </div>
      ),
    },
    {
      key: 'progress',
      header: 'Progression',
      cell: (round) => <RoundProgressCell progress={round.progress} />,
    },
    {
      key: 'collected',
      header: 'Collecté',
      align: 'right',
      cell: (round) => (
        <span className="num text-[15px] font-bold text-ink">{Money.from(round.collectedTotal).format()}</span>
      ),
    },
    {
      key: 'cash',
      header: 'Cash en main',
      cell: (round) => <CashGaugeCell cashInHand={round.cashInHand} cashHoldingCap={round.cashHoldingCap} />,
    },
    {
      key: 'status',
      header: 'Statut',
      cell: (round) => (
        <div className="flex flex-col items-start gap-0.5">
          <RoundStatusChip status={round.status} />
          {round.openDisputesCount > 0 && (
            <span className="text-[10.5px] font-bold text-danger">
              {round.openDisputesCount} contestation{round.openDisputesCount > 1 ? 's' : ''}
            </span>
          )}
        </div>
      ),
    },
  ];

  return (
    <PageShell title="Tournées" subtitle="Suivi temps réel · les chiffres évoluent en direct.">
      <RoundsStatsRow summary={summary} />
      <Table columns={columns} rows={rounds} rowKey={(round) => round.id} onRowClick={(round) => goToRound(round.id)} />
    </PageShell>
  );
};
