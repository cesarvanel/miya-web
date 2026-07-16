import React, { useState } from 'react';
import type { DailyCollectionPoint } from '../../../domain/entities/Supervision';

interface TrendChartProps {
  title: string;
  points: DailyCollectionPoint[];
  average: number;
}

const WIDTH = 640;
const HEIGHT = 200;
const PADDING = 24;

/** Tendance quotidienne — polyline SVG légère (pas de librairie de graphes dans le projet). */
export const TrendChart: React.FC<TrendChartProps> = ({ title, points, average }) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

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
  const hovered = hoverIndex !== null ? points[hoverIndex] : null;

  return (
    <div className="relative rounded-card-lg border border-line bg-card p-5">
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
        {points.map((point, index) => (
          <circle
            key={point.date}
            cx={toX(index)}
            cy={toY(point.amount)}
            r={hoverIndex === index ? 5 : 9}
            fill={hoverIndex === index ? 'var(--color-primary)' : 'transparent'}
            className="cursor-pointer transition-[r] duration-150 ease-out"
            onMouseEnter={() => setHoverIndex(index)}
            onMouseLeave={() => setHoverIndex((current) => (current === index ? null : current))}
          />
        ))}
      </svg>
      {hovered && hoverIndex !== null && (
        <div
          className="animate-fade-in pointer-events-none absolute rounded-lg bg-ink px-2.5 py-1.5 text-[11px] font-semibold text-white shadow-toast"
          style={{
            left: `${(toX(hoverIndex) / WIDTH) * 100}%`,
            top: `${(toY(hovered.amount) / HEIGHT) * 100}%`,
            transform: 'translate(-50%, -130%)',
          }}
        >
          <div className="num text-[12.5px] font-bold">{hovered.amount.toLocaleString('fr-FR')} FCFA</div>
          <div className="text-primary-tint">{hovered.date}</div>
        </div>
      )}
      <div className="mt-1 flex justify-between text-[11px] font-semibold text-ink-faint">
        <span>{points[0].date}</span>
        <span>Dernier point : {last.amount.toLocaleString('fr-FR')} FCFA</span>
        <span>{last.date}</span>
      </div>
    </div>
  );
};
