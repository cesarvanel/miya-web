import React, { useState } from 'react';
import { AmountInput, Button, Modal } from '@miya/ui';
import { Money } from '@miya/kernel';
import { useBankDispatch, useBankSelector } from '@/config/stores/root-hook/RootHook';
import { useModal } from '@/shared/modals';
import { RejectSettlementAsync } from '../../../application/usecases/reject-settlement-async/RejectSettlementAsync';
import { selectSlipById } from '../../../domain/selectors/Selectors';

export const RejectSettlementModal: React.FC = () => {
  const { isOpen, props, close } = useModal('rejectSettlement');
  const dispatch = useBankDispatch();
  const slip = useBankSelector((state) =>
    props ? selectSlipById(state, props.slipId) : undefined,
  );
  const [reason, setReason] = useState('');
  const [receivedAmount, setReceivedAmount] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !slip) {
    return null;
  }

  const expected = Money.from(slip.expectedAmount);
  const received = receivedAmount === null ? null : Money.from(receivedAmount);
  const missing = received ? expected.subtract(received) : null;
  const canSubmit = reason.trim() !== '' && receivedAmount !== null && !submitting;

  const reset = (): void => {
    setReason('');
    setReceivedAmount(null);
  };

  const handleClose = (): void => {
    reset();
    close();
  };

  const handleConfirm = async (): Promise<void> => {
    if (!canSubmit || receivedAmount === null) {
      return;
    }
    setSubmitting(true);
    await dispatch(
      RejectSettlementAsync({ id: slip.id, reason, receivedAmount }),
    );
    setSubmitting(false);
    reset();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} ariaLabel="Rejeter le reversement">
      <div>
        <div className="text-lg font-extrabold text-ink">Rejeter le reversement</div>
        <div className="text-sm font-medium text-ink-muted">
          {slip.agentName} · {slip.slipNumber}
        </div>
      </div>

      <div className="mt-[18px] overflow-hidden rounded-card border border-danger/25 bg-danger-soft">
        <div className="flex items-center justify-between border-b border-danger/15 px-4 py-[13px]">
          <span className="text-[13px] font-semibold text-danger-deep">
            Attendu · système
          </span>
          <span className="num text-base font-bold text-ink">
            {expected.format()}
          </span>
        </div>
        <div className="flex items-center justify-between border-b border-danger/15 px-4 py-[13px]">
          <span className="text-[13px] font-semibold text-danger-deep">
            Reçu · compté à deux
          </span>
          <AmountInput
            value={receivedAmount}
            onChange={setReceivedAmount}
            aria-label="Montant reçu, compté à deux"
          />
        </div>
        <div className="flex items-center justify-between bg-danger px-4 py-[14px]">
          <span className="text-[13px] font-bold text-white">Manquant</span>
          <span className="num text-lg font-bold text-white">
            {missing ? missing.format() : '—'}
          </span>
        </div>
      </div>

      <div className="mt-4">
        <label
          htmlFor="reject-settlement-reason"
          className="mb-2 block text-[12.5px] font-bold text-ink"
        >
          Motif du rejet <span className="text-danger">*</span>
        </label>
        <textarea
          id="reject-settlement-reason"
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          rows={3}
          placeholder="Décrivez l'écart constaté…"
          className="rounded-input focus-within:shadow-focus-ring w-full border border-line bg-card p-[13px] text-[13.5px] font-medium text-ink outline-none placeholder:text-ink-soft"
        />
      </div>

      <div className="mt-[14px] rounded-tile bg-amber-soft px-[13px] py-[11px] text-xs font-semibold text-amber-deep">
        Le rejet notifie l'agent, bloque la quittance et remonte l'écart à la
        supervision. Action irréversible.
      </div>

      <div className="mt-4 flex gap-[10px]">
        <Button variant="secondary" onClick={handleClose} className="flex-1">
          Annuler
        </Button>
        <Button
          variant="destructive"
          onClick={handleConfirm}
          loading={submitting}
          disabled={!canSubmit}
          className="flex-[1.4]"
        >
          Confirmer le rejet
        </Button>
      </div>
    </Modal>
  );
};
