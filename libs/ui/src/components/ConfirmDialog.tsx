import React, { useState } from 'react';
import { Button } from './Button';
import { Modal } from './Modal';
import { Textarea } from './Textarea';

export type ConfirmDialogTone = 'default' | 'destructive';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason?: string) => void;
  title: string;
  description: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: ConfirmDialogTone;
  /** Motif obligatoire — n'apparaît qu'en variante destructive. */
  reasonLabel?: string;
  loading?: boolean;
}

/** Dialogue de confirmation standard ou destructive (motif obligatoire), construit sur Modal. */
export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirmer',
  cancelLabel = 'Annuler',
  tone = 'default',
  reasonLabel,
  loading = false,
}) => {
  const [reason, setReason] = useState('');
  const requiresReason = tone === 'destructive' && Boolean(reasonLabel);
  const canConfirm = !requiresReason || reason.trim() !== '';

  const handleClose = (): void => {
    setReason('');
    onClose();
  };

  const handleConfirm = (): void => {
    if (!canConfirm) {
      return;
    }
    onConfirm(requiresReason ? reason : undefined);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      ariaLabel={title}
      width={tone === 'destructive' ? 388 : 376}
    >
      <div
        className={[
          'flex size-[46px] items-center justify-center rounded-[13px]',
          tone === 'destructive' ? 'bg-danger-soft' : 'bg-primary-soft',
        ].join(' ')}
      >
        {tone === 'destructive' ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 3l9 16H3L12 3z" stroke="#C43B32" strokeWidth="1.8" strokeLinejoin="round" />
            <path d="M12 9v5M12 16.5h.01" stroke="#C43B32" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="9" stroke="#0A6B4E" strokeWidth="1.8" />
            <path d="M8 12l2.5 2.5L16 9" stroke="#0A6B4E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <div className="mt-4 text-lg font-extrabold tracking-[-0.01em] text-ink">{title}</div>
      <div className="mt-2 text-[13.5px] leading-[1.55] font-medium text-ink-muted">
        {description}
      </div>
      {requiresReason && (
        <div className="mt-4">
          <Textarea
            label={reasonLabel ?? 'Motif'}
            value={reason}
            onChange={setReason}
            required
            placeholder="Précisez le motif…"
          />
        </div>
      )}
      <div className="mt-5 flex gap-[10px]">
        <Button variant="secondary" className="flex-1" onClick={handleClose}>
          {cancelLabel}
        </Button>
        <Button
          variant={tone === 'destructive' ? 'destructive' : 'primary'}
          className="flex-1"
          loading={loading}
          disabled={!canConfirm}
          onClick={handleConfirm}
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
};
