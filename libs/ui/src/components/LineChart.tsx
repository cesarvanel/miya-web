import React, { useEffect, useState } from 'react';

export interface LineChartSeries {
  id: string;
  label: string;
  /** Couleur hex de la ligne et de la puce de légende. */
  color: string;
  /** Alignés 1:1 avec `labels`. */
  points: number[];
}

interface LineChartProps {
  labels: string[];
  series: LineChartSeries[];
  formatValue?: (value: number) => string;
  className?: string;
}

const WIDTH = 640;
const HEIGHT = 230;
const PAD_LEFT = 40;
const PAD_TOP = 14;
const PLOT_BOTTOM = 200;
const PLOT_HEIGHT = PLOT_BOTTOM - PAD_TOP;

const projectX = (index: number, count: number): number =>
  count <= 1 ? PAD_LEFT : PAD_LEFT + (index * (WIDTH - PAD_LEFT)) / (count - 1);

const projectY = (value: number, max: number): number =>
  max <= 0 ? PLOT_BOTTOM : PLOT_BOTTOM - (value / max) * PLOT_HEIGHT;

/**
 * Graphique en courbes multi-séries — comparaison de banques dans le temps
 * (module activity). Grille légère, une polyline par série, point d'extrémité
 * en emphase, légende au-dessus. Entrée en fondu + léger essor au montage.
 */
export const LineChart: React.FC<LineChartProps> = ({ labels, series, formatValue, className }) => {
  const [grown, setGrown] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setGrown(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const format = formatValue ?? ((value: number) => value.toLocaleString('fr-FR'));
  const max = Math.max(...series.flatMap((line) => line.points), 1);
  const gridValues = [max, max * (2 / 3), max * (1 / 3)];

  const labelStride = Math.max(1, Math.ceil(labels.length / 6));

  return (
    <div className={className}>
      {series.length > 1 && (
        <div className="mb-2 flex flex-wrap gap-4">
          {series.map((line) => (
            <span key={line.id} className="flex items-center gap-1.5 text-[11.5px] font-semibold text-ink-muted">
              <span className="h-0.75 w-2.5 rounded-sm" style={{ backgroundColor: line.color }} />
              {line.label}
            </span>
          ))}
        </div>
      )}
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="block w-full" style={{ height: 'auto' }}>
        {gridValues.map((value) => (
          <line
            key={value}
            x1={PAD_LEFT}
            x2={WIDTH}
            y1={projectY(value, max)}
            y2={projectY(value, max)}
            stroke="#F0EEE8"
            strokeWidth={1}
          />
        ))}
        <line x1={PAD_LEFT} x2={WIDTH} y1={PLOT_BOTTOM} y2={PLOT_BOTTOM} stroke="#EAE7DF" strokeWidth={1} />
        {gridValues.map((value) => (
          <text key={value} x={0} y={projectY(value, max) + 4} fontSize="11" fill="#B5B3AA">
            {format(value)}
          </text>
        ))}

        <g
          style={{
            opacity: grown ? 1 : 0,
            transform: grown ? 'translateY(0)' : 'translateY(6px)',
            transition: 'opacity 500ms ease-out, transform 500ms ease-out',
          }}
        >
          {series.map((line) => {
            const pointsAttr = line.points
              .map((value, index) => `${projectX(index, line.points.length)},${projectY(value, max)}`)
              .join(' ');
            const lastIndex = line.points.length - 1;
            return (
              <g key={line.id}>
                <polyline
                  points={pointsAttr}
                  fill="none"
                  stroke={line.color}
                  strokeWidth={2.6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {lastIndex >= 0 && (
                  <circle
                    cx={projectX(lastIndex, line.points.length)}
                    cy={projectY(line.points[lastIndex], max)}
                    r={3.5}
                    fill={line.color}
                  />
                )}
              </g>
            );
          })}
        </g>

        {labels.map((label, index) =>
          index % labelStride === 0 || index === labels.length - 1 ? (
            <text key={index} x={projectX(index, labels.length)} y={HEIGHT - 6} fontSize="11" fill="#9A9C93" textAnchor="middle">
              {label}
            </text>
          ) : null,
        )}
      </svg>
    </div>
  );
};
