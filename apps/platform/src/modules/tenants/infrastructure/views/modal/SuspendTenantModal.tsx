import React, { useState } from 'react';
import { Button, Modal } from '@miya/ui';
import { usePlatformDispatch, usePlatformSelector } from '@/config/root-hook';
import { useModal } from '@/shared/modals';
import { SuspendTenantAsync } from '../../../application/usecases/suspend-tenant-async/SuspendTenantAsync';
import { selectTenantById } from '../../../domain/selectors/Selectors';

const REASON_PRESETS = ["Impayé d'abonnement", 'Demande du client', 'Non-conformité', 'Autre'];

/** Suspension — action destructive, motif obligatoire. Maquette 2c. */
export const SuspendTenantModal: React.FC = () => {
  const { isOpen, props, close } = useModal('suspendTenant');
  const dispatch = usePlatformDispatch();
  const tenant = usePlatformSelector((state) => (props ? selectTenantById(state, props.tenantId) : undefined));
  const [preset, setPreset] = useState<string | null>(null);
  const [reason, setReason] = useState('');
  const [acknowledged, setAcknowledged] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !tenant) {
    return null;
  }

  const canSubmit = reason.trim() !== '' && acknowledged && !submitting;

  const reset = (): void => {
    setPreset(null);
    setReason('');
    setAcknowledged(false);
  };

  const handleClose = (): void => {
    reset();
    close();
  };

  const selectPreset = (label: string): void => {
    setPreset(label);
    if (label !== 'Autre') {
      setReason(label);
    } else if (preset !== null) {
      setReason('');
    }
  };

  const handleConfirm = async (): Promise<void> => {
    if (!canSubmit) {
      return;
    }
    setSubmitting(true);
    await dispatch(SuspendTenantAsync({ tenantId: tenant.id, reason }));
    setSubmitting(false);
    reset();
    close();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} ariaLabel={`Suspendre ${tenant.name}`} width={480}>
      <div className="flex items-start gap-3.5">
        <div className="flex size-13 flex-none items-center justify-center rounded-[15px] bg-danger-soft">
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
            <path d="M13 3l11 19H2L13 3z" stroke="#C43B32" strokeWidth="2" strokeLinejoin="round" />
            <path d="M13 10v5M13 18.5h.01" stroke="#C43B32" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <div>
          <div className="text-lg font-extrabold tracking-[-0.01em] text-ink">Suspendre {tenant.name} ?</div>
          <div className="mt-0.5 text-[12.5px] font-medium text-ink-muted">Cette action coupe immédiatement l&rsquo;accès du tenant.</div>
        </div>
      </div>

      <div className="mt-4.5 flex gap-2.75 rounded-[14px] border border-[#C9E7D8] bg-[#F4FAF7] px-4 py-3.5">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="mt-px flex-none" aria-hidden="true">
          <path d="M10 2.5l6.5 3v4.5c0 4-2.8 6.3-6.5 7.5-3.7-1.2-6.5-3.5-6.5-7.5V5.5L10 2.5z" stroke="#0F9E6C" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M7.5 10l1.7 1.7L13 8" stroke="#0F9E6C" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div className="text-[12.5px] leading-[1.55] font-medium text-[#2E5344]">
          Les <b>données de la banque sont conservées</b> — agents, clients, cotisations et historique. Seul l&rsquo;accès est bloqué ; la réactivation restaure tout à l&rsquo;identique.
        </div>
      </div>

      <div className="mt-4.5">
        <label className="text-[12.5px] font-bold text-ink">
          Motif de la suspension <span className="text-danger">*</span>
        </label>
        <div className="mt-2 flex flex-wrap gap-1.75">
          {REASON_PRESETS.map((label) => (
            <button
              key={label}
              type="button"
              onClick={() => selectPreset(label)}
              className={[
                'cursor-pointer rounded-full px-3.25 py-1.75 text-xs font-bold transition-colors',
                preset === label ? 'bg-admin-sidebar text-white' : 'bg-cream-100 text-ink hover:bg-cream-50',
              ].join(' ')}
            >
              {label}
            </button>
          ))}
        </div>
        <textarea
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          rows={3}
          placeholder="Précisez le motif…"
          className="rounded-input focus-within:shadow-focus-ring mt-2.5 w-full border border-line bg-cream p-[13px] text-[13px] font-medium text-ink-muted outline-none placeholder:text-ink-soft"
        />
      </div>

      <label className="mt-4 flex cursor-pointer items-center gap-2.5">
        <span
          onClick={() => setAcknowledged((current) => !current)}
          className={[
            'flex size-5 flex-none cursor-pointer items-center justify-center rounded-[6px]',
            acknowledged ? 'bg-danger' : 'border border-line',
          ].join(' ')}
        >
          {acknowledged && (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M2.5 6l2.5 2.5L9.5 3.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </span>
        <span className="text-[12.5px] font-semibold text-ink">Je comprends que l&rsquo;accès de la banque sera coupé immédiatement.</span>
      </label>

      <div className="mt-5 flex gap-2.5">
        <Button variant="secondary" onClick={handleClose} className="flex-1">
          Annuler
        </Button>
        <Button variant="destructive" onClick={handleConfirm} loading={submitting} disabled={!canSubmit} className="flex-[1.4]">
          Suspendre la banque
        </Button>
      </div>
    </Modal>
  );
};
