import React from 'react';
import { Link } from 'react-router-dom';
import { InitialsAvatar, Table, type TableColumn } from '@miya/ui';
import { AdoptionTrend, type AdoptionStat } from '../../../domain/entities/AdoptionStat';

interface AdoptionTableProps {
  stats: AdoptionStat[];
}

const ADOPTION_ATTENTION_THRESHOLD = 0.65;

const TrendArrow: React.FC<{ trend: AdoptionTrend }> = ({ trend }) => {
  if (trend === AdoptionTrend.Up) {
    return <span className="text-primary">▲</span>;
  }
  if (trend === AdoptionTrend.Down) {
    return <span className="text-danger">▼</span>;
  }
  return <span className="text-ink-faint">▬</span>;
};

/** Table d'adoption — agents créés / actifs 30j / taux, tendance. Les banques à accompagner d'abord. Maquette 4a. */
export const AdoptionTable: React.FC<AdoptionTableProps> = ({ stats }) => {
  const columns: TableColumn<AdoptionStat>[] = [
    {
      key: 'tenant',
      header: 'Banque',
      cell: (stat) => (
        <Link to={`/tenants/${stat.tenantId}`} className="flex min-w-0 items-center gap-2.75 hover:underline">
          <InitialsAvatar name={stat.tenantName} />
          <span className="truncate text-[13.5px] font-bold text-ink">{stat.tenantName}</span>
        </Link>
      ),
    },
    {
      key: 'created',
      header: 'Créés',
      sortValue: (stat) => stat.agentsCreated,
      cell: (stat) => <span className="num text-[13px] font-bold text-ink">{stat.agentsCreated}</span>,
    },
    {
      key: 'active',
      header: 'Actifs · 30j',
      sortValue: (stat) => stat.agentsActive30d,
      cell: (stat) => <span className="num text-[13px] font-bold text-ink">{stat.agentsActive30d}</span>,
    },
    {
      key: 'rate',
      header: 'Taux',
      sortValue: (stat) => stat.adoptionRate,
      cell: (stat) => {
        const isLow = stat.adoptionRate < ADOPTION_ATTENTION_THRESHOLD;
        return (
          <div className="flex min-w-28 items-center gap-2.5">
            <div className="h-1.75 flex-1 overflow-hidden rounded-full bg-line">
              <div
                className={['h-full rounded-full transition-[width] duration-500 ease-out', isLow ? 'bg-amber' : 'bg-primary'].join(' ')}
                style={{ width: `${Math.min(100, stat.adoptionRate * 100)}%` }}
              />
            </div>
            <span className={['num text-[12.5px] font-bold', isLow ? 'text-amber' : 'text-primary'].join(' ')}>
              {Math.round(stat.adoptionRate * 100)}%
            </span>
          </div>
        );
      },
    },
    {
      key: 'trend',
      header: 'Tendance',
      align: 'right',
      cell: (stat) => <TrendArrow trend={stat.trend} />,
    },
  ];

  return (
    <Table
      columns={columns}
      rows={stats}
      rowKey={(stat) => stat.tenantId}
      initialSort={{ key: 'rate', direction: 'asc' }}
      emptyState={<div className="text-center text-sm font-medium text-ink-faint">Aucune donnée d&rsquo;adoption.</div>}
    />
  );
};
