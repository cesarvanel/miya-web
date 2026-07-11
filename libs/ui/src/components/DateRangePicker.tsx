import React, { useState } from 'react';
import { useOutsideClick } from '../internal/useOutsideClick';

export interface DateRange {
  start: Date;
  end: Date;
}

export type DateRangePreset =
  | 'today'
  | 'yesterday'
  | 'last7'
  | 'last30'
  | 'thisMonth'
  | 'custom';

interface DateRangePickerProps {
  value: DateRange;
  presetId: DateRangePreset;
  onApply: (range: DateRange, presetId: DateRangePreset) => void;
}

const PRESETS: { id: DateRangePreset; label: string }[] = [
  { id: 'today', label: "Aujourd'hui" },
  { id: 'yesterday', label: 'Hier' },
  { id: 'last7', label: '7 derniers jours' },
  { id: 'last30', label: '30 derniers jours' },
  { id: 'thisMonth', label: 'Ce mois-ci' },
  { id: 'custom', label: 'Plage personnalisée' },
];

const WEEKDAY_INITIALS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

const startOfDay = (date: Date): Date => {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
};
const addDays = (date: Date, amount: number): Date => {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + amount);
  return copy;
};
const addMonths = (date: Date, amount: number): Date => {
  const copy = new Date(date);
  copy.setMonth(copy.getMonth() + amount);
  return copy;
};
const isSameDay = (a: Date, b: Date): boolean =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();
const firstOfMonth = (date: Date): Date => new Date(date.getFullYear(), date.getMonth(), 1);
const daysInMonth = (date: Date): number =>
  new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
/** Lundi = 0 … dimanche = 6. */
const mondayIndex = (date: Date): number => (date.getDay() + 6) % 7;

const monthLabel = (date: Date): string => {
  const raw = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(date);
  return raw.charAt(0).toUpperCase() + raw.slice(1);
};
const shortDateLabel = (date: Date): string =>
  new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short' }).format(date);

const computePresetRange = (id: DateRangePreset, today: Date): DateRange | null => {
  const end = startOfDay(today);
  switch (id) {
    case 'today':
      return { start: end, end };
    case 'yesterday': {
      const yesterday = addDays(end, -1);
      return { start: yesterday, end: yesterday };
    }
    case 'last7':
      return { start: addDays(end, -6), end };
    case 'last30':
      return { start: addDays(end, -29), end };
    case 'thisMonth':
      return { start: firstOfMonth(end), end };
    default:
      return null;
  }
};

const formatRangeLabel = (range: DateRange): string => {
  const sameYear = range.start.getFullYear() === range.end.getFullYear();
  const sameMonth = sameYear && range.start.getMonth() === range.end.getMonth();
  if (isSameDay(range.start, range.end)) {
    return `${shortDateLabel(range.start)} ${range.start.getFullYear()}`;
  }
  if (sameMonth) {
    const monthShort = new Intl.DateTimeFormat('fr-FR', { month: 'short' }).format(range.end);
    return `${range.start.getDate()} – ${range.end.getDate()} ${monthShort} ${range.end.getFullYear()}`;
  }
  return `${shortDateLabel(range.start)} – ${shortDateLabel(range.end)} ${range.end.getFullYear()}`;
};

/**
 * Sélecteur de période — presets + plage personnalisée, semaines lundi →
 * dimanche, mois en français. État replié (bouton) / ouvert (presets +
 * 2 calendriers). L'application (Annuler/Appliquer) se fait au pied du panneau.
 */
export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  value,
  presetId,
  onApply,
}) => {
  const [isOpen, setOpen] = useState(false);
  const [draftPreset, setDraftPreset] = useState<DateRangePreset>(presetId);
  const [draftRange, setDraftRange] = useState<DateRange>(value);
  const [pickingStart, setPickingStart] = useState(true);
  const [leftMonth, setLeftMonth] = useState<Date>(firstOfMonth(value.start));
  const ref = useOutsideClick<HTMLDivElement>(() => setOpen(false), isOpen);

  const handleOpen = (): void => {
    setDraftPreset(presetId);
    setDraftRange(value);
    setPickingStart(true);
    setLeftMonth(firstOfMonth(value.start));
    setOpen(true);
  };

  const handlePresetClick = (id: DateRangePreset): void => {
    setDraftPreset(id);
    const range = computePresetRange(id, new Date());
    if (range) {
      setDraftRange(range);
      setLeftMonth(firstOfMonth(range.start));
      setPickingStart(true);
    }
  };

  const handleDayClick = (date: Date): void => {
    setDraftPreset('custom');
    if (pickingStart) {
      setDraftRange({ start: date, end: date });
      setPickingStart(false);
    } else if (date < draftRange.start) {
      setDraftRange({ start: date, end: draftRange.start });
      setPickingStart(true);
    } else {
      setDraftRange({ start: draftRange.start, end: date });
      setPickingStart(true);
    }
  };

  const handleApply = (): void => {
    onApply(draftRange, draftPreset);
    setOpen(false);
  };

  const renderMonth = (monthDate: Date, showPrev: boolean, showNext: boolean): React.ReactNode => {
    const total = daysInMonth(monthDate);
    const leadingBlanks = mondayIndex(firstOfMonth(monthDate));
    const cells: (Date | null)[] = [
      ...Array<null>(leadingBlanks).fill(null),
      ...Array.from({ length: total }, (_, index) =>
        new Date(monthDate.getFullYear(), monthDate.getMonth(), index + 1),
      ),
    ];

    return (
      <div>
        <div className="mb-3 flex items-center justify-between">
          <button
            type="button"
            aria-label="Mois précédent"
            onClick={() => setLeftMonth(addMonths(leftMonth, -1))}
            className={[
              'flex size-[26px] items-center justify-center rounded-lg border border-line',
              showPrev ? 'cursor-pointer hover:bg-cream-50' : 'invisible',
            ].join(' ')}
          >
            ‹
          </button>
          <span className="text-[13.5px] font-extrabold text-ink">{monthLabel(monthDate)}</span>
          <button
            type="button"
            aria-label="Mois suivant"
            onClick={() => setLeftMonth(addMonths(leftMonth, 1))}
            className={[
              'flex size-[26px] items-center justify-center rounded-lg border border-line',
              showNext ? 'cursor-pointer hover:bg-cream-50' : 'invisible',
            ].join(' ')}
          >
            ›
          </button>
        </div>
        <div className="mb-1 grid grid-cols-7 gap-0.5">
          {WEEKDAY_INITIALS.map((initial, index) => (
            <span
              key={index}
              className="text-center text-[10.5px] font-bold text-ink-disabled"
            >
              {initial}
            </span>
          ))}
        </div>
        <div className="num grid grid-cols-7 auto-rows-[30px] gap-0.5 text-[12.5px] font-semibold">
          {cells.map((date, index) => {
            if (!date) {
              return <span key={index} />;
            }
            const isStart = isSameDay(date, draftRange.start);
            const isEnd = isSameDay(date, draftRange.end);
            const inRange = date > draftRange.start && date < draftRange.end;
            return (
              <button
                key={index}
                type="button"
                onClick={() => handleDayClick(date)}
                className={[
                  'flex cursor-pointer items-center justify-center',
                  isStart && isEnd
                    ? 'rounded-lg bg-primary font-bold text-white'
                    : isStart
                      ? 'rounded-l-lg bg-primary font-bold text-white'
                      : isEnd
                        ? 'rounded-r-lg bg-primary font-bold text-white'
                        : inRange
                          ? 'bg-primary-soft text-ink'
                          : 'text-ink hover:bg-cream-50',
                ].join(' ')}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const dayCount =
    Math.round((startOfDay(draftRange.end).getTime() - startOfDay(draftRange.start).getTime()) / 86_400_000) +
    1;
  const collapsedLabel =
    presetId === 'custom'
      ? formatRangeLabel(value)
      : (PRESETS.find((preset) => preset.id === presetId)?.label ?? formatRangeLabel(value));

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        onClick={handleOpen}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        className="flex cursor-pointer items-center gap-[9px] rounded-xl border border-line bg-card px-[14px] py-[11px] transition hover:bg-cream-50"
      >
        <svg width="17" height="17" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <rect x="3" y="4.5" width="14" height="12.5" rx="2" stroke="#16241E" strokeWidth="1.5" />
          <path d="M3 8h14M7 3v3M13 3v3" stroke="#16241E" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span className="num text-[13.5px] font-bold text-ink">{collapsedLabel}</span>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="ml-0.5">
          <path d="M4 5.5L7 8.5l3-3" stroke="#6B7069" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-label="Sélectionner une période"
          className="rounded-modal absolute top-[52px] left-0 z-20 flex overflow-hidden border border-line bg-card shadow-[0_24px_50px_-22px_rgba(0,0,0,.35)]"
        >
          <div className="flex w-[158px] flex-none flex-col gap-[3px] border-r border-line-soft p-2.5">
            {PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handlePresetClick(preset.id)}
                className={[
                  'cursor-pointer rounded-lg px-3 py-[9px] text-left text-[13px] font-semibold transition',
                  draftPreset === preset.id
                    ? 'bg-primary-soft font-bold text-primary'
                    : 'text-ink hover:bg-cream-50',
                ].join(' ')}
              >
                {preset.label}
              </button>
            ))}
          </div>
          <div className="p-4">
            <div className="flex gap-[26px]">
              {renderMonth(leftMonth, true, false)}
              {renderMonth(addMonths(leftMonth, 1), false, true)}
            </div>
            <div className="mt-[14px] flex items-center justify-between border-t border-line-soft pt-[14px]">
              <span className="num text-[12.5px] font-semibold text-ink-muted">
                Du <b className="text-ink">{shortDateLabel(draftRange.start)}</b> au{' '}
                <b className="text-ink">
                  {shortDateLabel(draftRange.end)} {draftRange.end.getFullYear()}
                </b>{' '}
                · {dayCount} jour{dayCount > 1 ? 's' : ''}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="cursor-pointer rounded-[10px] bg-cream-100 px-[14px] py-2 text-[12.5px] font-bold text-ink-muted hover:bg-line"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleApply}
                  className="cursor-pointer rounded-[10px] bg-primary px-4 py-2 text-[12.5px] font-bold text-white hover:bg-primary/90"
                >
                  Appliquer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
