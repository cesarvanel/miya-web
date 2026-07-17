import React from 'react';
import { Link } from 'react-router-dom';
import { Money } from '@miya/kernel';
import { InvoiceStatus, type Invoice } from '@/modules/billing';

interface BillingHistoryTableProps {
  tenantId: string;
  invoices: Invoice[];
}

const STATUS_CLASSES: Record<InvoiceStatus, string> = {
  [InvoiceStatus.Paid]: 'bg-primary-soft text-primary',
  [InvoiceStatus.Pending]: 'bg-amber-soft text-amber',
  [InvoiceStatus.Overdue]: 'bg-danger-soft text-danger',
};

const STATUS_LABELS: Record<InvoiceStatus, string> = {
  [InvoiceStatus.Paid]: 'Payée',
  [InvoiceStatus.Pending]: 'En attente',
  [InvoiceStatus.Overdue]: 'Impayée',
};

/** Historique de facturation de la banque — données réelles du module billing. */
export const BillingHistoryTable: React.FC<BillingHistoryTableProps> = ({ tenantId, invoices }) => (
  <div className="overflow-hidden rounded-card-lg border border-line bg-card">
    <div className="flex items-center justify-between px-5.5 pt-4.5 pb-3">
      <span className="text-[15px] font-extrabold text-ink">Historique de facturation</span>
      <Link to={`/billing?tenantId=${tenantId}`} className="text-[12.5px] font-bold text-admin-primary hover:underline">
        Voir toutes les factures
      </Link>
    </div>
    {invoices.length === 0 ? (
      <div className="px-5.5 pb-4.5 text-sm font-medium text-ink-faint">Aucune facture pour le moment.</div>
    ) : (
      <>
        <div className="grid grid-cols-[1.3fr_1fr_1fr_1fr] gap-3 border-t border-b border-line-soft bg-cream-50 px-5.5 py-2.25 text-[11px] font-bold tracking-[.04em] text-ink-soft uppercase">
          <span>Facture</span>
          <span>Période</span>
          <span>Montant</span>
          <span>Statut</span>
        </div>
        {invoices.map((invoice, index) => (
          <div
            key={invoice.id}
            className={[
              'grid grid-cols-[1.3fr_1fr_1fr_1fr] items-center gap-3 px-5.5 py-3',
              index < invoices.length - 1 ? 'border-b border-line-faint' : '',
              invoice.status === InvoiceStatus.Overdue ? 'bg-[#FDF7F6]' : '',
            ].join(' ')}
          >
            <span className="num text-[13px] font-bold text-ink">{invoice.id}</span>
            <span className="text-[12.5px] font-semibold text-ink-muted">{invoice.period}</span>
            <span className={['num text-[13.5px] font-bold', invoice.status === InvoiceStatus.Overdue ? 'text-danger' : 'text-ink'].join(' ')}>
              {Money.from(invoice.amount).format()}
            </span>
            <span className={['w-fit rounded-full px-2.5 py-1 text-[11.5px] font-bold', STATUS_CLASSES[invoice.status]].join(' ')}>
              {STATUS_LABELS[invoice.status]}
            </span>
          </div>
        ))}
      </>
    )}
  </div>
);
