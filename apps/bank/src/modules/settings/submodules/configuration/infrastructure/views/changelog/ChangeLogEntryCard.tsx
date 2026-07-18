import React from 'react';
import type { ChangeLogEntry } from '@miya/kernel';

interface ChangeLogEntryCardProps {
  entry: ChangeLogEntry;
  isLast: boolean;
}

const SECTION_DOT_COLOR: Record<string, string> = {
  'Règles de collecte': 'bg-primary',
  Plans: 'bg-[#7A56A8]',
  Identité: 'bg-primary',
  Validation: 'bg-amber-strong',
  'Frais de garde': 'bg-primary',
};

const formatTime = (iso: string): string => {
  const date = new Date(iso);
  return `${String(date.getHours()).padStart(2, '0')}h${String(date.getMinutes()).padStart(2, '0')}`;
};

/** Ligne de chronologie — ancien → nouveau, non modifiable. Maquette 9i. */
export const ChangeLogEntryCard: React.FC<ChangeLogEntryCardProps> = ({ entry, isLast }) => (
  <div className="flex gap-3.25 pb-4.5">
    <div className="flex flex-none flex-col items-center">
      <span className={['size-2.75 rounded-full', SECTION_DOT_COLOR[entry.section] ?? 'bg-ink-faint'].join(' ')} />
      {!isLast && <span className="mt-0.75 w-0.5 flex-1 bg-line-soft" />}
    </div>
    <div className="flex-1 rounded-2xl border border-line bg-card p-3.5">
      <div className="flex items-center justify-between">
        <span className="text-[13.5px] font-bold text-ink">{entry.field}</span>
        <span className="num text-[11.5px] font-semibold text-ink-faint">{formatTime(entry.at)}</span>
      </div>
      <div className="my-1.5 text-[11.5px] font-semibold text-ink-faint">
        {entry.section} · par {entry.by}
      </div>
      {entry.oldValue === '—' ? (
        <div className="text-[12.5px] font-semibold text-ink">{entry.newValue}</div>
      ) : (
        <div className="flex flex-wrap items-center gap-2">
          <span className="num rounded-lg bg-danger-soft px-2.5 py-1 text-[12px] font-bold text-danger line-through">{entry.oldValue}</span>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 8h8m0 0L8.5 5.5M11 8l-2.5 2.5" stroke="#8A8A82" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="num bg-primary-soft rounded-lg px-2.5 py-1 text-[12px] font-bold text-primary">{entry.newValue}</span>
        </div>
      )}
    </div>
  </div>
);
