import React, { useMemo } from 'react';
import { LineChart, type LineChartSeries } from '@miya/ui';
import type { BankUsagePoint } from '../../../domain/entities/BankUsagePoint';

interface UsageChartCardProps {
  points: BankUsagePoint[];
  tenantNames: Record<string, string>;
  title: string;
}

const SERIES_COLORS = ['#0F9E6C', '#2A6BA8', '#B5771A', '#7A56A8', '#C43B32'];

const shortDayLabel = (isoDate: string): string =>
  new Date(isoDate).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });

/** Courbes d'usage par banque — nombre de collectes agrégées/jour (comptage, jamais de montant client). Maquette 4a. */
export const UsageChartCard: React.FC<UsageChartCardProps> = ({ points, tenantNames, title }) => {
  const { labels, series } = useMemo(() => {
    const tenantIds = [...new Set(points.map((point) => point.tenantId))];
    const dates = [...new Set(points.map((point) => point.date))].sort();

    const builtSeries: LineChartSeries[] = tenantIds.map((tenantId, index) => {
      const byDate = new Map(points.filter((point) => point.tenantId === tenantId).map((point) => [point.date, point.collectionsCount]));
      return {
        id: tenantId,
        label: tenantNames[tenantId] ?? tenantId,
        color: SERIES_COLORS[index % SERIES_COLORS.length],
        points: dates.map((date) => byDate.get(date) ?? 0),
      };
    });

    return { labels: dates.map(shortDayLabel), series: builtSeries };
  }, [points, tenantNames]);

  return (
    <div className="rounded-card-lg border border-line bg-card p-[20px_22px]">
      <div className="text-[15px] font-extrabold text-ink">{title}</div>
      <div className="mt-0.5 mb-1 text-xs font-medium text-ink-faint">Agrégé · collectes journalières · comptage uniquement</div>
      {series.length === 0 || labels.length === 0 ? (
        <div className="py-10 text-center text-sm font-medium text-ink-faint">Aucune donnée pour cette période.</div>
      ) : (
        <LineChart labels={labels} series={series} className="mt-2" />
      )}
    </div>
  );
};
