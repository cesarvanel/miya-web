import React, { useState } from 'react';
import { ConfirmDialog } from '@miya/ui';
import { Money } from '@miya/kernel';
import { usePlatformDispatch, usePlatformSelector } from '@/config/root-hook';
import { useModal } from '@/shared/modals';
import { SendReminderAsync } from '../../../application/usecases/send-reminder-async/SendReminderAsync';
import { scheduleSuspensionFromDueDate } from '../../../domain/entities/Invoice';
import { BillingSelectors } from '../../../domain/selectors/Selectors';

const longDate = (iso: string): string => new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

/** Relance d'une facture — récap + conséquence explicite : la suspension reste une décision manuelle. Maquette 3d. */
export const SendReminderModal: React.FC = () => {
  const { isOpen, props, close } = useModal('sendReminder');
  const dispatch = usePlatformDispatch();
  const invoice = usePlatformSelector((state) => (props ? BillingSelectors.selectInvoiceById(state, props.invoiceId) : undefined));
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !invoice) {
    return null;
  }

  const previewSuspensionAt = invoice.scheduledSuspensionAt ?? scheduleSuspensionFromDueDate(invoice.dueAt);

  const handleClose = (): void => {
    close();
  };

  const handleConfirm = async (): Promise<void> => {
    setSubmitting(true);
    await dispatch(SendReminderAsync({ invoiceId: invoice.id }));
    setSubmitting(false);
    close();
  };

  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={handleClose}
      onConfirm={handleConfirm}
      loading={submitting}
      title={`Relancer ${invoice.tenantName} ?`}
      confirmLabel="Envoyer la relance"
      description={
        <>
          Facture <b className="num text-ink">{invoice.id}</b> · <b className="num text-ink">{Money.from(invoice.amount).format()}</b> ·{' '}
          échéance dépassée le <b className="text-ink">{longDate(invoice.dueAt)}</b>.
          <br />
          <br />
          Sans paiement, la suspension sera programmée au <b className="text-danger">{longDate(previewSuspensionAt)}</b> — elle
          restera une décision manuelle.
        </>
      }
    />
  );
};
