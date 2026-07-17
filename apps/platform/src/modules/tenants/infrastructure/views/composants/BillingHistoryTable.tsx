import React from 'react';
import { Money } from '@miya/kernel';
import { BillingStatus, type Tenant } from '../../../domain/entities/Tenant';

interface BillingHistoryTableProps {
  tenant: Tenant;
}

const MONTH_LABELS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

/**
 * Historique de facturation — le module billing n'est pas encore construit ;
 * 3 échéances dérivées du plan courant, la plus récente reflète billingStatus.
 */
export const BillingHistoryTable: React.FC<BillingHistoryTableProps> = ({ tenant }) => {
  const now = new Date();
  const rows = [0, 1, 2].map((monthsAgo) => {
    const date = new Date(now.getFullYear(), now.getMonth() - monthsAgo, 1);
    const isCurrent = monthsAgo === 0;
    const isOverdue = isCurrent && tenant.billingStatus === BillingStatus.Overdue;
    return {
      reference: `FAC-${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}${date.getDate() === 1 ? '01' : ''}`,
      period: `${MONTH_LABELS[date.getMonth()]} ${date.getFullYear()}`,
      amount: tenant.plan.monthlyPrice,
      isOverdue,
    };
  });

  return (
    <div className="overflow-hidden rounded-card-lg border border-line bg-card">
      <div className="px-5.5 pt-4.5 pb-3 text-[15px] font-extrabold text-ink">Historique de facturation</div>
      <div className="grid grid-cols-[1.3fr_1fr_1fr_1fr] gap-3 border-t border-b border-line-soft bg-cream-50 px-5.5 py-2.25 text-[11px] font-bold tracking-[.04em] text-ink-soft uppercase">
        <span>Facture</span>
        <span>Période</span>
        <span>Montant</span>
        <span>Statut</span>
      </div>
      {rows.map((row, index) => (
        <div
          key={row.reference}
          className={[
            'grid grid-cols-[1.3fr_1fr_1fr_1fr] items-center gap-3 px-5.5 py-3',
            index < rows.length - 1 ? 'border-b border-line-faint' : '',
            row.isOverdue ? 'bg-[#FDF7F6]' : '',
          ].join(' ')}
        >
          <span className="num text-[13px] font-bold text-ink">{row.reference}</span>
          <span className="text-[12.5px] font-semibold text-ink-muted">{row.period}</span>
          <span className={['num text-[13.5px] font-bold', row.isOverdue ? 'text-danger' : 'text-ink'].join(' ')}>
            {Money.from(row.amount).format()}
          </span>
          {row.isOverdue ? (
            <span className="w-fit rounded-full bg-danger-soft px-2.5 py-1 text-[11.5px] font-bold text-danger">Impayée</span>
          ) : (
            <span className="bg-primary-soft text-primary w-fit rounded-full px-2.5 py-1 text-[11.5px] font-bold">Payée</span>
          )}
        </div>
      ))}
    </div>
  );
};
