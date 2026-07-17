import React, { useEffect, useState } from 'react';

export interface BarChartPoint {
  label: string;
  value: number;
}

interface BarChartProps {
  points: BarChartPoint[];
  formatValue?: (value: number) => string;
  className?: string;
}

/** Barre verticale la plus intense pour les valeurs hautes, en dégradé selon le ratio au max. */
const intensityClass = (ratio: number): string => {
  if (ratio >= 0.9) {
    return 'bg-primary';
  }
  if (ratio >= 0.65) {
    return 'bg-primary/60';
  }
  return 'bg-primary/25';
};

/**
 * Graphique en barres — montée de 0 à la valeur cible au montage, décalage
 * par barre (stagger léger). Valeur au-dessus, libellé en dessous, dernière
 * barre en emphase (libellé plus foncé).
 */
export const BarChart: React.FC<BarChartProps> = ({ points, formatValue, className }) => {
  const [grown, setGrown] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setGrown(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const max = Math.max(...points.map((point) => point.value), 1);
  const format = formatValue ?? ((value: number) => value.toLocaleString('fr-FR'));

  return (
    <div className={className}>
      <div className="flex h-45 items-end gap-5.5 border-b-[1.5px] border-line-faint px-1">
        {points.map((point, index) => {
          const isLast = index === points.length - 1;
          const ratio = point.value / max;
          return (
            <div key={point.label} className="flex h-full flex-1 flex-col items-center justify-end">
              <span
                className={[
                  'num mb-1.5 text-[11px] font-bold',
                  isLast ? 'text-[12px] text-primary' : 'text-ink-faint',
                ].join(' ')}
              >
                {format(point.value)}
              </span>
              <div
                className={['w-full max-w-11.5 rounded-t-lg transition-[height] duration-500 ease-out', intensityClass(ratio)].join(' ')}
                style={{ height: grown ? `${ratio * 100}%` : '0%', transitionDelay: `${index * 45}ms` }}
              />
            </div>
          );
        })}
      </div>
      <div className="flex gap-5.5 px-1 pt-2.5">
        {points.map((point, index) => (
          <span
            key={point.label}
            className={[
              'flex-1 text-center text-[11.5px] font-semibold',
              index === points.length - 1 ? 'text-xs font-bold text-ink' : 'text-ink-faint',
            ].join(' ')}
          >
            {point.label}
          </span>
        ))}
      </div>
    </div>
  );
};
