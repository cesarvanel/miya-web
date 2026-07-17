import React, { useState } from 'react';
import { Button, Modal, RadioGroup } from '@miya/ui';
import { Money } from '@miya/kernel';
import { authSelectors } from '@/modules/auth';
import { usePlatformDispatch, usePlatformSelector } from '@/config/root-hook';
import { useModal } from '@/shared/modals';
import { MarkInvoicePaidAsync } from '../../../application/usecases/mark-invoice-paid-async/MarkInvoicePaidAsync';
import { PaymentMethod } from '../../../domain/entities/Invoice';
import { BillingSelectors } from '../../../domain/selectors/Selectors';

const METHOD_OPTIONS = [
  { value: PaymentMethod.MobileMoney, label: 'Mobile Money' },
  { value: PaymentMethod.BankTransfer, label: 'Virement' },
];

const todayIsoDate = (): string => new Date().toISOString().slice(0, 10);

/** Enregistrement d'un paiement reçu hors plateforme — l'étape de confiance. Maquette 3c. */
export const MarkInvoicePaidModal: React.FC = () => {
  const { isOpen, props, close } = useModal('markInvoicePaid');
  const dispatch = usePlatformDispatch();
  const invoice = usePlatformSelector((state) => (props ? BillingSelectors.selectInvoiceById(state, props.invoiceId) : undefined));
  const currentUserName = usePlatformSelector(authSelectors.selectCurrentUserDisplayName);

  const [method, setMethod] = useState<PaymentMethod>(PaymentMethod.MobileMoney);
  const [receivedAt, setReceivedAt] = useState(todayIsoDate());
  const [reference, setReference] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !invoice) {
    return null;
  }

  const reset = (): void => {
    setMethod(PaymentMethod.MobileMoney);
    setReceivedAt(todayIsoDate());
    setReference('');
  };

  const handleClose = (): void => {
    reset();
    close();
  };

  const handleConfirm = async (): Promise<void> => {
    if (submitting) {
      return;
    }
    setSubmitting(true);
    await dispatch(
      MarkInvoicePaidAsync({
        invoiceId: invoice.id,
        method,
        receivedAt: new Date(receivedAt).toISOString(),
        reference: reference.trim() || undefined,
      }),
    );
    setSubmitting(false);
    reset();
    close();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      ariaLabel="Enregistrer un paiement reçu"
      width={480}
      header={
        <div>
          <div className="text-[19px] font-extrabold tracking-[-0.01em] text-ink">Enregistrer un paiement reçu</div>
          <div className="mt-0.5 text-[12.5px] font-medium text-ink-muted">
            Facture <span className="num">{invoice.id}</span> · {invoice.tenantName}
          </div>
        </div>
      }
      footer={
        <div className="flex gap-2.5">
          <Button variant="secondary" onClick={handleClose} className="flex-1">
            Annuler
          </Button>
          <Button variant="primary" onClick={handleConfirm} loading={submitting} className="flex-[1.4]">
            Enregistrer le paiement
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between rounded-[14px] border border-line bg-card px-4 py-3.5">
          <div>
            <div className="text-xs font-semibold text-ink-faint">Montant dû</div>
            <div className="num mt-0.5 text-[22px] font-bold text-ink">{Money.from(invoice.amount).format()}</div>
          </div>
          <span className="rounded-full bg-amber-soft px-2.75 py-1.25 text-[11.5px] font-bold text-amber">
            {invoice.period} · {invoice.planName}
          </span>
        </div>

        <div>
          <label className="text-[12.5px] font-bold text-ink">Moyen de paiement</label>
          <div className="mt-2">
            <RadioGroup options={METHOD_OPTIONS} value={method} onChange={(value) => setMethod(value as PaymentMethod)} />
          </div>
        </div>

        <div>
          <label className="text-[12.5px] font-bold text-ink">Date de réception</label>
          <input
            type="date"
            value={receivedAt}
            onChange={(event) => setReceivedAt(event.target.value)}
            className="rounded-input focus-within:shadow-focus-ring num mt-1.5 w-full border border-line bg-card px-3.5 py-2.75 text-[14px] font-semibold text-ink outline-none"
          />
        </div>

        <div>
          <label className="text-[12.5px] font-bold text-ink">Référence de transaction</label>
          <input
            type="text"
            value={reference}
            onChange={(event) => setReference(event.target.value)}
            placeholder="Optionnelle"
            className="rounded-input focus-within:shadow-focus-ring mt-1.5 w-full border border-line bg-card px-3.5 py-2.75 text-[14px] font-medium text-ink outline-none placeholder:text-ink-soft"
          />
        </div>

        <div className="text-[12px] font-semibold text-ink-faint">Enregistré par {currentUserName}.</div>
      </div>
    </Modal>
  );
};
