import React from 'react';
import { Link } from 'react-router-dom';
import { KpiCard, Skeleton, Table, type TableColumn } from '@miya/ui';
import { Money } from '@miya/kernel';
import { PageShell } from '@/shared/layout/PageShell';
import { InvoiceStatus, type Invoice } from '../../../domain/entities/Invoice';
import type { PlanName } from '../../../domain/entities/Plan';
import type { InvoiceStatusFilter } from '../../../domain/selectors/Selectors';
import { InvoiceStatusBadge } from '../composants/InvoiceStatusBadge';
import { PlanCard } from '../composants/PlanCard';
import { useBillingPage } from './useBillingPage';

const PLAN_BADGE_CLASSES: Record<PlanName, string> = {
  Élite: 'bg-violet-soft text-violet',
  Croissance: 'bg-primary-soft text-primary',
  Essentiel: 'bg-cream-100 text-ink-faint',
};

const CHIPS: { id: InvoiceStatusFilter; label: string }[] = [
  { id: 'all', label: 'Toutes' },
  { id: 'paid', label: 'Payées' },
  { id: 'pending', label: 'En attente' },
  { id: 'overdue', label: 'En retard' },
];

const shortDate = (iso: string): string => new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });

/** Abonnements & facturation — plans du catalogue + factures émises. Maquette 3a. */
export const BillingPage: React.FC = () => {
  const {
    plans,
    featuredPlanId,
    mrr,
    totals,
    counts,
    status,
    setStatus,
    invoices,
    tenantId,
    isPending,
    openEditPlan,
    openMarkInvoicePaid,
    openSendReminder,
  } = useBillingPage();

  const columns: TableColumn<Invoice>[] = [
    {
      key: 'tenant',
      header: 'Banque',
      cell: (invoice) => (
        <div className="min-w-0">
          <Link to={`/tenants/${invoice.tenantId}`} className="truncate text-[13.5px] font-bold text-ink hover:underline">
            {invoice.tenantName}
          </Link>
          <div className="num truncate text-[11px] font-semibold text-ink-faint">{invoice.id}</div>
        </div>
      ),
    },
    {
      key: 'plan',
      header: 'Plan',
      cell: (invoice) => (
        <span className={['w-fit rounded-full px-2.75 py-1.25 text-[11.5px] font-bold', PLAN_BADGE_CLASSES[invoice.planName]].join(' ')}>
          {invoice.planName}
        </span>
      ),
    },
    { key: 'period', header: 'Période', cell: (invoice) => <span className="text-[12.5px] font-semibold text-ink-muted">{invoice.period}</span> },
    {
      key: 'amount',
      header: 'Montant',
      sortValue: (invoice) => invoice.amount,
      cell: (invoice) => (
        <span className={['num text-sm font-bold', invoice.status === InvoiceStatus.Overdue ? 'text-danger' : 'text-ink'].join(' ')}>
          {Money.from(invoice.amount).format()}
        </span>
      ),
    },
    { key: 'dueAt', header: 'Échéance', cell: (invoice) => <span className="num text-[12.5px] font-semibold text-ink-muted">{shortDate(invoice.dueAt)}</span> },
    { key: 'status', header: 'Statut', cell: (invoice) => <InvoiceStatusBadge invoice={invoice} /> },
    {
      key: 'actions',
      header: '',
      align: 'right',
      cell: (invoice) => (
        <div className="flex justify-end gap-1.5">
          {invoice.status !== InvoiceStatus.Paid && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                openMarkInvoicePaid(invoice.id);
              }}
              className="shadow-primary-glow cursor-pointer rounded-[10px] bg-primary px-3 py-1.75 text-xs font-bold text-white"
            >
              Marquer payée
            </button>
          )}
          {invoice.status === InvoiceStatus.Overdue && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                openSendReminder(invoice.id);
              }}
              className="cursor-pointer rounded-[10px] bg-cream-100 px-3 py-1.75 text-xs font-bold text-ink"
            >
              Relancer
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <PageShell
      title="Abonnements & facturation"
      subtitle={`${plans.length} plans actifs · ${counts.all} facture${counts.all > 1 ? 's' : ''}${tenantId ? ' · filtré sur une banque' : ''}`}
    >
      <div className="mb-5.5 grid grid-cols-4 gap-3.5">
        <KpiCard
          tone="primary"
          label="Revenu récurrent (MRR)"
          value={mrr}
          formatter={(v) => `${(v / 1_000_000).toLocaleString('fr-FR', { maximumFractionDigits: 2 })} M`}
          hint={<span className="text-primary-tint">FCFA</span>}
        />
        <KpiCard
          label="Encaissé"
          value={totals.paid}
          formatter={(v) => `${(v / 1_000_000).toLocaleString('fr-FR', { maximumFractionDigits: 2 })} M`}
          hint={<span className="text-primary">{counts.paid} facture{counts.paid > 1 ? 's' : ''} réglée{counts.paid > 1 ? 's' : ''}</span>}
        />
        <KpiCard
          label="En attente"
          value={totals.pending}
          formatter={(v) => `${(v / 1_000).toLocaleString('fr-FR', { maximumFractionDigits: 0 })} k`}
          hint={<span className="text-amber">{counts.pending} facture{counts.pending > 1 ? 's' : ''}</span>}
        />
        <KpiCard
          tone="danger"
          pulse={counts.overdue > 0}
          label="En retard"
          value={totals.overdue}
          formatter={(v) => `${(v / 1_000).toLocaleString('fr-FR', { maximumFractionDigits: 0 })} k`}
          hint={<span className="text-danger">{counts.overdue} facture{counts.overdue > 1 ? 's' : ''}</span>}
        />
      </div>

      <div className="mb-3 flex items-center justify-between">
        <div className="text-[16px] font-extrabold text-ink">Plans de la plateforme</div>
        <span className="text-[12.5px] font-semibold text-ink-muted">Tarifs mensuels en FCFA · appliqués au prochain cycle après édition</span>
      </div>
      {plans.length === 0 && isPending ? (
        <div className="mb-6.5 grid grid-cols-3 gap-3.5">
          <Skeleton variant="card" />
          <Skeleton variant="card" />
          <Skeleton variant="card" />
        </div>
      ) : (
        <div className="mb-6.5 grid grid-cols-3 gap-3.5">
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} featured={plan.id === featuredPlanId} onEdit={() => openEditPlan(plan.id)} />
          ))}
        </div>
      )}

      <div className="mb-3 text-[16px] font-extrabold text-ink">Factures émises</div>
      <div className="mb-3.5 flex items-center gap-2">
        {CHIPS.map((chip) => (
          <button
            key={chip.id}
            type="button"
            onClick={() => setStatus(chip.id)}
            className={[
              'cursor-pointer rounded-full px-3.5 py-1.75 text-[12.5px] font-bold transition-colors',
              status === chip.id ? 'bg-admin-sidebar text-white' : 'border border-line bg-card text-ink hover:bg-cream-50',
            ].join(' ')}
          >
            {chip.label} · {counts[chip.id]}
          </button>
        ))}
      </div>

      {isPending && invoices.length === 0 ? (
        <Skeleton variant="card" />
      ) : (
        <Table
          columns={columns}
          rows={invoices}
          rowKey={(invoice) => invoice.id}
          initialSort={{ key: 'amount', direction: 'desc' }}
          emptyState={<div className="text-center text-sm font-medium text-ink-faint">Aucune facture ne correspond à ces filtres.</div>}
        />
      )}
    </PageShell>
  );
};
