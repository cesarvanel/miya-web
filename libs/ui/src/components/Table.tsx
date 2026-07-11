import React, { useMemo, useState } from 'react';
import { Pagination } from './Pagination';

export interface TableColumn<TRow> {
  key: string;
  header: React.ReactNode;
  cell: (row: TRow) => React.ReactNode;
  /** Requis pour rendre la colonne triable. */
  sortValue?: (row: TRow) => string | number;
  align?: 'left' | 'right';
  width?: string;
}

export interface TableSort {
  key: string;
  direction: 'asc' | 'desc';
}

export interface TablePagination {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
  totalItems?: number;
  pageSize?: number;
  itemLabel?: string;
}

interface TableProps<TRow> {
  columns: TableColumn<TRow>[];
  rows: TRow[];
  rowKey: (row: TRow) => string;
  /** Contenu affiché quand `rows` est vide. */
  emptyState?: React.ReactNode;
  onRowClick?: (row: TRow) => void;
  /** Tri initial (le tri se pilote ensuite par les en-têtes). */
  initialSort?: TableSort;
  /** Ligne mise en surbrillance (liseré vert). */
  selectedRowKey?: string;
  /** Rend `<Pagination/>` sous la table quand fourni. */
  pagination?: TablePagination;
}

const compareValues = (a: string | number, b: string | number): number => {
  if (typeof a === 'number' && typeof b === 'number') {
    return a - b;
  }
  return String(a).localeCompare(String(b), 'fr');
};

const SortArrow: React.FC<{ direction: 'asc' | 'desc' | null }> = ({
  direction,
}) => (
  <span
    aria-hidden="true"
    className={[
      'text-[9px] leading-none',
      direction === null ? 'text-ink-disabled' : 'text-ink',
    ].join(' ')}
  >
    {direction === 'desc' ? '▼' : '▲'}
  </span>
);

/**
 * Composant générique : pas typable en React.FC (paramètre de type TRow),
 * la convention arrow function + interface Props est conservée.
 */
export const Table = <TRow,>({
  columns,
  rows,
  rowKey,
  emptyState,
  onRowClick,
  initialSort,
  selectedRowKey,
  pagination,
}: TableProps<TRow>): React.ReactElement => {
  const [sort, setSort] = useState<TableSort | null>(initialSort ?? null);

  const sortedRows = useMemo(() => {
    if (!sort) {
      return rows;
    }
    const column = columns.find((col) => col.key === sort.key);
    const sortValue = column?.sortValue;
    if (!sortValue) {
      return rows;
    }
    const factor = sort.direction === 'asc' ? 1 : -1;
    return [...rows].sort(
      (a, b) => factor * compareValues(sortValue(a), sortValue(b)),
    );
  }, [rows, columns, sort]);

  const toggleSort = (key: string): void => {
    setSort((current) =>
      current?.key === key
        ? { key, direction: current.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: 'asc' },
    );
  };

  return (
    <div className="overflow-hidden rounded-card-lg border border-line bg-card">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-line-soft bg-cream-50">
            {columns.map((column) => {
              const sortable = Boolean(column.sortValue);
              const direction = sort?.key === column.key ? sort.direction : null;
              return (
                <th
                  key={column.key}
                  scope="col"
                  style={column.width ? { width: column.width } : undefined}
                  aria-sort={
                    direction === null
                      ? undefined
                      : direction === 'asc'
                        ? 'ascending'
                        : 'descending'
                  }
                  className={[
                    'px-[22px] py-[11px] text-[11px] font-bold tracking-[.04em] text-ink-soft uppercase',
                    column.align === 'right' ? 'text-right' : 'text-left',
                  ].join(' ')}
                >
                  {sortable ? (
                    <button
                      type="button"
                      onClick={() => toggleSort(column.key)}
                      className={[
                        'inline-flex cursor-pointer items-center gap-1 uppercase',
                        'hover:text-ink-muted',
                        direction !== null ? 'text-ink' : '',
                      ].join(' ')}
                    >
                      {column.header}
                      <SortArrow direction={direction} />
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sortedRows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-[22px] py-10">
                {emptyState ?? (
                  <div className="text-center text-sm font-medium text-ink-faint">
                    Aucune donnée
                  </div>
                )}
              </td>
            </tr>
          ) : (
            sortedRows.map((row) => {
              const key = rowKey(row);
              const isSelected = key === selectedRowKey;
              return (
                <tr
                  key={key}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={[
                    'border-b border-line-faint last:border-b-0',
                    onRowClick ? 'cursor-pointer' : '',
                    isSelected
                      ? 'bg-[#F3FAF6] shadow-[inset_3px_0_0_#0A6B4E]'
                      : 'hover:bg-cream-50 hover:shadow-[inset_3px_0_0_#D8D5CC]',
                  ].join(' ')}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={[
                        'px-[22px] py-[15px] text-sm',
                        column.align === 'right' ? 'text-right' : 'text-left',
                      ].join(' ')}
                    >
                      {column.cell(row)}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
      {pagination && (
        <Pagination
          page={pagination.page}
          pageCount={pagination.pageCount}
          onChange={pagination.onChange}
          totalItems={pagination.totalItems}
          pageSize={pagination.pageSize}
          itemLabel={pagination.itemLabel}
        />
      )}
    </div>
  );
};
