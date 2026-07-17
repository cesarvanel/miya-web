import React, { useLayoutEffect, useRef, useState } from 'react';
import { CountUp } from '@miya/ui';
import type { PlatformKpis } from '../../../domain/entities/Overview';
import type { OverviewPeriod } from '../index/useOverviewPage';

interface HeroVolumeCardProps {
  kpis: PlatformKpis;
  period: OverviewPeriod;
  onPeriodChange: (period: OverviewPeriod) => void;
}

const PERIODS: { id: OverviewPeriod; label: string }[] = [
  { id: 'month', label: 'Mois' },
  { id: 'day', label: 'Jour' },
];

const formatCompact = (fcfa: number): string => {
  if (fcfa >= 1_000_000_000) {
    return `${(fcfa / 1_000_000_000).toLocaleString('fr-FR', { maximumFractionDigits: 2 })} Md`;
  }
  return `${(fcfa / 1_000_000).toLocaleString('fr-FR', { maximumFractionDigits: 1 })} M`;
};

/** Tuile héro du KPI « Volume collecté » — bascule Jour/Mois à pastille glissante. */
export const HeroVolumeCard: React.FC<HeroVolumeCardProps> = ({ kpis, period, onPeriodChange }) => {
  const buttonsRef = useRef<Map<OverviewPeriod, HTMLButtonElement>>(new Map());
  const [pill, setPill] = useState<{ left: number; width: number } | null>(null);

  useLayoutEffect(() => {
    const activeButton = buttonsRef.current.get(period);
    if (activeButton) {
      setPill({ left: activeButton.offsetLeft, width: activeButton.offsetWidth });
    }
  }, [period]);

  const mainValue = period === 'month' ? kpis.volumeMonth : kpis.volumeToday;
  const captionValue = period === 'month' ? kpis.volumeToday : kpis.volumeMonth;
  const captionSuffix = period === 'month' ? "aujourd'hui" : 'ce mois';

  return (
    <div className="rounded-card-lg bg-admin-sidebar p-[18px] text-white shadow-[0_16px_30px_-18px_rgba(19,32,27,.7)]">
      <div className="flex items-center justify-between">
        <span className="text-[12.5px] font-semibold text-admin-item">Volume collecté</span>
        <div className="relative flex rounded-[9px] bg-white/8 p-0.5">
          {pill && (
            <div
              aria-hidden="true"
              className="bg-admin-accent absolute top-0.5 bottom-0.5 rounded-[7px] transition-[left,width] duration-250 ease-out"
              style={{ left: pill.left, width: pill.width }}
            />
          )}
          {PERIODS.map((item) => (
            <button
              key={item.id}
              ref={(el) => {
                if (el) {
                  buttonsRef.current.set(item.id, el);
                } else {
                  buttonsRef.current.delete(item.id);
                }
              }}
              type="button"
              onClick={() => onPeriodChange(item.id)}
              className={[
                'relative z-10 cursor-pointer rounded-[7px] px-2.25 py-0.75 text-[10.5px] font-bold transition-colors duration-200',
                period === item.id ? 'text-admin-sidebar' : 'text-admin-item',
              ].join(' ')}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      <div className="num mt-3 text-[30px] font-bold tracking-[-0.02em]">
        <CountUp value={mainValue} formatter={formatCompact} />
      </div>
      <div className="mt-2 flex items-center gap-1.5">
        <span className="bg-admin-accent text-admin-sidebar rounded-full px-2 py-0.75 text-[11px] font-bold">
          ▲ +{kpis.volumeMonthGrowthPct}%
        </span>
        <span className="num text-[11.5px] font-medium text-admin-item">
          {formatCompact(captionValue)} {captionSuffix} · FCFA
        </span>
      </div>
    </div>
  );
};
