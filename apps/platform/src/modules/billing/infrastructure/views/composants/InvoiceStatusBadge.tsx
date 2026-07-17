import React from 'react';
import { InvoiceStatus, type Invoice } from '../../../domain/entities/Invoice';

interface InvoiceStatusBadgeProps {
  invoice: Invoice;
}

const DAY_MS = 24 * 60 * 60 * 1000;

const shortDate = (iso: string): string => new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });

/** Statut + compte à rebours dérivé de `scheduledSuspensionAt` pour les factures en retard. Maquette 3a. */
export const InvoiceStatusBadge: React.FC<InvoiceStatusBadgeProps> = ({ invoice }) => {
  if (invoice.status === InvoiceStatus.Paid) {
    return (
      <span className="bg-primary-soft text-primary w-fit rounded-full px-2.75 py-1.25 text-[11.5px] font-bold">
        ● Payée{invoice.payment ? ` · ${shortDate(invoice.payment.receivedAt)}` : ''}
      </span>
    );
  }

  if (invoice.status === InvoiceStatus.Pending) {
    const daysLeft = Math.max(0, Math.ceil((new Date(invoice.dueAt).getTime() - Date.now()) / DAY_MS));
    return (
      <span className="w-fit rounded-full bg-amber-soft px-2.75 py-1.25 text-[11.5px] font-bold text-amber">
        ● En attente · {daysLeft}j
      </span>
    );
  }

  const daysLate = Math.max(0, Math.floor((Date.now() - new Date(invoice.dueAt).getTime()) / DAY_MS));
  const daysUntilSuspension = invoice.scheduledSuspensionAt
    ? Math.ceil((new Date(invoice.scheduledSuspensionAt).getTime() - Date.now()) / DAY_MS)
    : null;

  return (
    <div className="flex flex-col gap-0.75">
      <span className="w-fit rounded-full bg-danger-soft px-2.75 py-1.25 text-[11.5px] font-bold text-danger">
        ● En retard · {daysLate}j
      </span>
      {daysUntilSuspension !== null && (
        <span className="text-[11px] font-semibold text-danger">
          Suspension le {shortDate(invoice.scheduledSuspensionAt as string)} · J-{daysUntilSuspension}
        </span>
      )}
    </div>
  );
};
