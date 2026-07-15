import React from 'react';
import type { DailyCollectionPoint } from '../../../domain/entities/Supervision';

interface TrendChartProps {
  title: string;
  points: DailyCollectionPoint[];
  average: number;
}

const WIDTH = 640;
const HEIGHT = 200;
const PADDING = 24;

/**
 * Tendance quotidienne — polyline SVG légère (pas de librairie de graphes
 * dans le projet). Simplification assumée vs la maquette : pas de tooltip
 * interactif point-par-point.
 */
export const TrendChart: React.FC<TrendChartProps> = ({ title, points, average }) => {
  if (points.length === 0) {
    return null;
  }
  const amounts = points.map((point) => point.amount);
  const max = Math.max(...amounts, average);
  const min = Math.min(...amounts, 0);
  const range = max - min || 1;

  const toX = (index: number): number => PADDING + (index / (points.length - 1)) * (WIDTH - PADDING * 2);
  const toY = (amount: number): number => HEIGHT - PADDING - ((amount - min) / range) * (HEIGHT - PADDING * 2);

  const linePath = points.map((point, index) => `${index === 0 ? 'M' : 'L'}${toX(index)},${toY(point.amount)}`).join(' ');
  const areaPath = `${linePath} L${toX(points.length - 1)},${HEIGHT - PADDING} L${toX(0)},${HEIGHT - PADDING} Z`;
  const averageY = toY(average);
  const last = points[points.length - 1];

  return (
    <div className="rounded-card-lg border border-line bg-card p-5">
      <div className="mb-1 flex items-baseline justify-between">
        <span className="text-[15px] font-extrabold text-ink">{title}</span>
        <span className="text-[11.5px] font-semibold text-ink-faint">
          Moyenne {average.toLocaleString('fr-FR')} FCFA
        </span>
      </div>
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="mt-2 w-full" role="img" aria-label={title}>
        <line x1={PADDING} y1={averageY} x2={WIDTH - PADDING} y2={averageY} stroke="#B9BAB2" strokeDasharray="4 4" strokeWidth={1} />
        <path d={areaPath} fill="var(--color-primary-soft)" opacity={0.5} />
        <path d={linePath} fill="none" stroke="var(--color-primary)" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
        <circle cx={toX(points.length - 1)} cy={toY(last.amount)} r={3.5} fill="var(--color-primary)" />
      </svg>
      <div className="mt-1 flex justify-between text-[11px] font-semibold text-ink-faint">
        <span>{points[0].date}</span>
        <span>Dernier point : {last.amount.toLocaleString('fr-FR')} FCFA</span>
        <span>{last.date}</span>
      </div>
    </div>
  );
};
