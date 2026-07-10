import { fireEvent, render, screen, within } from '@testing-library/react';
import { Table, type TableColumn } from './Table';

interface AgentRow {
  id: string;
  name: string;
  amount: number;
}

const columns: TableColumn<AgentRow>[] = [
  {
    key: 'name',
    header: 'Agent',
    cell: (row) => row.name,
    sortValue: (row) => row.name,
  },
  {
    key: 'amount',
    header: 'Collecté',
    align: 'right',
    cell: (row) => row.amount,
    sortValue: (row) => row.amount,
  },
  { key: 'actions', header: 'Actions', cell: () => '…' },
];

const rows: AgentRow[] = [
  { id: '1', name: 'Cédric Nkoulou', amount: 52000 },
  { id: '2', name: 'Aïcha Bello', amount: 127500 },
  { id: '3', name: 'Grace Atangana', amount: 39000 },
];

const renderedNames = (): string[] =>
  screen
    .getAllByRole('row')
    .slice(1) // en-tête
    .map((row) => within(row).getAllByRole('cell')[0].textContent ?? '');

describe('Table', () => {
  it('renders rows in given order without sort', () => {
    render(<Table columns={columns} rows={rows} rowKey={(r) => r.id} />);
    expect(renderedNames()).toEqual([
      'Cédric Nkoulou',
      'Aïcha Bello',
      'Grace Atangana',
    ]);
  });

  it('sorts ascending on first header click, descending on second', () => {
    render(<Table columns={columns} rows={rows} rowKey={(r) => r.id} />);
    const header = screen.getByRole('button', { name: /Collecté/ });

    fireEvent.click(header);
    expect(renderedNames()).toEqual([
      'Grace Atangana',
      'Cédric Nkoulou',
      'Aïcha Bello',
    ]);

    fireEvent.click(header);
    expect(renderedNames()).toEqual([
      'Aïcha Bello',
      'Cédric Nkoulou',
      'Grace Atangana',
    ]);
  });

  it('sorts strings with the fr locale', () => {
    render(<Table columns={columns} rows={rows} rowKey={(r) => r.id} />);
    fireEvent.click(screen.getByRole('button', { name: /Agent/ }));
    expect(renderedNames()).toEqual([
      'Aïcha Bello',
      'Cédric Nkoulou',
      'Grace Atangana',
    ]);
  });

  it('does not make non-sortable headers clickable', () => {
    render(<Table columns={columns} rows={rows} rowKey={(r) => r.id} />);
    expect(screen.queryByRole('button', { name: 'Actions' })).toBeNull();
  });

  it('applies initialSort', () => {
    render(
      <Table
        columns={columns}
        rows={rows}
        rowKey={(r) => r.id}
        initialSort={{ key: 'amount', direction: 'desc' }}
      />,
    );
    expect(renderedNames()).toEqual([
      'Aïcha Bello',
      'Cédric Nkoulou',
      'Grace Atangana',
    ]);
  });

  it('shows the empty state when there is no row', () => {
    render(
      <Table
        columns={columns}
        rows={[]}
        rowKey={(r: AgentRow) => r.id}
        emptyState={<div>Aucun agent</div>}
      />,
    );
    expect(screen.getByText('Aucun agent')).toBeDefined();
  });

  it('notifies row clicks', () => {
    const onRowClick = vi.fn();
    render(
      <Table
        columns={columns}
        rows={rows}
        rowKey={(r) => r.id}
        onRowClick={onRowClick}
      />,
    );
    fireEvent.click(screen.getByText('Grace Atangana'));
    expect(onRowClick).toHaveBeenCalledWith(rows[2]);
  });
});
