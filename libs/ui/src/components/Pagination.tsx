import React from 'react';

interface PaginationProps {
  /** Page courante, 1-indexée. */
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
  /** Active le résumé "1 – 20 sur 1 284 clients" (nécessite totalItems + pageSize). */
  totalItems?: number;
  pageSize?: number;
  /** Nom au pluriel utilisé dans le résumé (ex. "clients"). */
  itemLabel?: string;
}

type PageEntry = number | 'ellipsis';

/** Premier, dernier, courant ± 1 — le reste devient des ellipses. */
const buildPageEntries = (page: number, pageCount: number): PageEntry[] => {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }
  const keep = new Set(
    [1, pageCount, page - 1, page, page + 1].filter((p) => p >= 1 && p <= pageCount),
  );
  const sorted = [...keep].sort((a, b) => a - b);
  const entries: PageEntry[] = [];
  sorted.forEach((current, index) => {
    const previous = sorted[index - 1];
    if (index > 0 && previous !== undefined && current - previous > 1) {
      entries.push('ellipsis');
    }
    entries.push(current);
  });
  return entries;
};

const navButtonClasses =
  'flex size-8.5 flex-none cursor-pointer items-center justify-center rounded-[9px] border border-line bg-card transition hover:bg-cream-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-card';

/** Pagination numérotée (avec ellipses) — rien si une seule page. */
export const Pagination: React.FC<PaginationProps> = ({
  page,
  pageCount,
  onChange,
  totalItems,
  pageSize,
  itemLabel,
}) => {
  if (pageCount <= 1) {
    return null;
  }

  const entries = buildPageEntries(page, pageCount);
  const showSummary = totalItems !== undefined && pageSize !== undefined;
  const rangeStart = showSummary ? (page - 1) * (pageSize ?? 0) + 1 : 0;
  const rangeEnd = showSummary ? Math.min(page * (pageSize ?? 0), totalItems ?? 0) : 0;

  return (
    <div className="flex items-center justify-between border-t border-line-soft bg-cream-50 px-4.5 py-2.75">
      {showSummary ? (
        <span className="num text-[12.5px] font-semibold text-ink-muted">
          {rangeStart} – {rangeEnd} sur <b className="text-ink">{totalItems}</b>{' '}
          {itemLabel ?? ''}
        </span>
      ) : (
        <span />
      )}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          aria-label="Page précédente"
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
          className={navButtonClasses}
        >
          <svg width="13" height="13" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path
              d="M7.5 2.5l-3 3.5 3 3.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={page <= 1 ? 'text-ink-disabled' : 'text-ink'}
            />
          </svg>
        </button>
        {entries.map((entry, index) =>
          entry === 'ellipsis' ? (
            <span
              key={`ellipsis-${index}`}
              className="num flex size-8.5 items-center justify-center text-[13px] font-semibold text-ink-soft"
            >
              …
            </span>
          ) : (
            <button
              key={entry}
              type="button"
              aria-current={entry === page ? 'page' : undefined}
              onClick={() => onChange(entry)}
              className={[
                'num flex size-8.5 cursor-pointer items-center justify-center rounded-[9px] text-[13px] font-semibold transition',
                entry === page
                  ? 'bg-primary font-bold text-white'
                  : 'border border-line text-ink hover:bg-cream-100',
              ].join(' ')}
            >
              {entry}
            </button>
          ),
        )}
        <button
          type="button"
          aria-label="Page suivante"
          disabled={page >= pageCount}
          onClick={() => onChange(page + 1)}
          className={navButtonClasses}
        >
          <svg width="13" height="13" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path
              d="M4.5 2.5l3 3.5-3 3.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={page >= pageCount ? 'text-ink-disabled' : 'text-ink'}
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
