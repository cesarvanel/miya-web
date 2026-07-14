import React, { useEffect, useState } from 'react';
import { Button, Modal } from '@miya/ui';
import { Money } from '@miya/kernel';
import { useBankDispatch, useBankSelector } from '@/config/stores/root-hook/RootHook';
import { useModal } from '@/shared/modals';
import { CustodyFeeMode, type CustodyFees } from '../../../domain/entities/BankSettings';
import { selectCustodyFees } from '../../../domain/selectors/Selectors';
import { UpdateCustodyFeesAsync } from '../../../application/usecases/update-custody-fees-async/UpdateCustodyFeesAsync';

const PREVIEW_AMOUNT_PER_DAY = 1_000;
const PREVIEW_COLLECTED_ON_CYCLE = 31_000;

/** Calcule le montant de frais du même moment que le domaine (aperçu direct côté vue, formule simple et publique). */
const computePreviewFee = (mode: CustodyFeeMode, cycleDays: number | null, percentage: number | null): number => {
  if (mode === CustodyFeeMode.OnePerCycle) {
    return PREVIEW_AMOUNT_PER_DAY;
  }
  if (mode === CustodyFeeMode.Percentage) {
    return Math.round((PREVIEW_COLLECTED_ON_CYCLE * (percentage ?? 0)) / 100);
  }
  return 0;
};

export const CustodyFeesModal: React.FC = () => {
  const { isOpen, close } = useModal('editCustodyFees');
  const dispatch = useBankDispatch();
  const custodyFees = useBankSelector(selectCustodyFees);

  const [mode, setMode] = useState<CustodyFeeMode>(CustodyFeeMode.OnePerCycle);
  const [cycleDays, setCycleDays] = useState(31);
  const [percentage, setPercentage] = useState(2.5);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && custodyFees) {
      setMode(custodyFees.mode);
      setCycleDays(custodyFees.cycleDays ?? 31);
      setPercentage(custodyFees.percentage ?? 2.5);
    }
  }, [isOpen, custodyFees]);

  if (!isOpen || !custodyFees) {
    return null;
  }

  const previewFee = computePreviewFee(mode, cycleDays, percentage);

  const handleSave = async (): Promise<void> => {
    setSubmitting(true);
    const payload: CustodyFees =
      mode === CustodyFeeMode.OnePerCycle
        ? { mode, cycleDays }
        : mode === CustodyFeeMode.Percentage
          ? { mode, percentage }
          : { mode };
    await dispatch(UpdateCustodyFeesAsync(payload));
    setSubmitting(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={close} ariaLabel="Frais de garde" width={660}>
      <div className="text-lg font-extrabold text-ink">Frais de garde</div>
      <div className="mt-1 text-[12.5px] font-medium text-ink-muted">Rémunération du service de collecte à domicile</div>

      <div className="mt-5">
        <div className="mb-2.5 text-[11.5px] font-bold text-ink">Mode de calcul</div>
        <div className="flex flex-col gap-2.5">
          <button
            type="button"
            onClick={() => setMode(CustodyFeeMode.OnePerCycle)}
            className={['rounded-2xl border p-3.75 text-left transition', mode === CustodyFeeMode.OnePerCycle ? 'border-[1.5px] border-primary bg-primary-soft/40' : 'border-line'].join(' ')}
          >
            <div className="flex items-start gap-2.75">
              <span className={['mt-0.5 flex size-4.5 flex-none items-center justify-center rounded-full border-2', mode === CustodyFeeMode.OnePerCycle ? 'border-primary' : 'border-line'].join(' ')}>
                {mode === CustodyFeeMode.OnePerCycle && <span className="size-2.25 rounded-full bg-primary" />}
              </span>
              <div className="flex-1">
                <div className="text-[14px] font-bold text-ink">Une cotisation par cycle</div>
                <div className="text-[12px] font-medium text-ink-muted">La banque retient l&rsquo;équivalent d&rsquo;un versement à chaque cycle.</div>
              </div>
            </div>
            {mode === CustodyFeeMode.OnePerCycle && (
              <div className="mt-3.25 flex items-center gap-3 pl-7.25">
                <span className="text-[12px] font-semibold text-ink-muted">Durée du cycle</span>
                <div className="flex items-center gap-1.5 rounded-lg border border-line bg-card px-3 py-2">
                  <input
                    type="number"
                    min={1}
                    value={cycleDays}
                    onClick={(event) => event.stopPropagation()}
                    onChange={(event) => setCycleDays(Math.max(1, Number(event.target.value)))}
                    className="num w-12 border-none bg-transparent text-[15px] font-bold text-ink outline-none"
                  />
                  <span className="text-[11.5px] font-bold text-ink-faint">jours</span>
                </div>
              </div>
            )}
          </button>

          <button
            type="button"
            onClick={() => setMode(CustodyFeeMode.Percentage)}
            className={['rounded-2xl border p-3.75 text-left transition', mode === CustodyFeeMode.Percentage ? 'border-[1.5px] border-primary bg-primary-soft/40' : 'border-line'].join(' ')}
          >
            <div className="flex items-start gap-2.75">
              <span className={['mt-0.5 flex size-4.5 flex-none items-center justify-center rounded-full border-2', mode === CustodyFeeMode.Percentage ? 'border-primary' : 'border-line'].join(' ')}>
                {mode === CustodyFeeMode.Percentage && <span className="size-2.25 rounded-full bg-primary" />}
              </span>
              <div className="flex-1">
                <div className="text-[14px] font-bold text-ink">Pourcentage du collecté</div>
                <div className="text-[12px] font-medium text-ink-muted">Un pourcentage du total collecté sur le cycle.</div>
              </div>
            </div>
            {mode === CustodyFeeMode.Percentage && (
              <div className="mt-3.25 flex items-center gap-3 pl-7.25">
                <div className="flex items-center gap-1.5 rounded-lg border border-line bg-card px-3 py-2">
                  <input
                    type="number"
                    step={0.1}
                    min={0}
                    value={percentage}
                    onClick={(event) => event.stopPropagation()}
                    onChange={(event) => setPercentage(Number(event.target.value))}
                    className="num w-14 border-none bg-transparent text-[15px] font-bold text-ink outline-none"
                  />
                  <span className="text-[11.5px] font-bold text-ink-faint">%</span>
                </div>
              </div>
            )}
          </button>

          <button
            type="button"
            onClick={() => setMode(CustodyFeeMode.None)}
            className={['rounded-2xl border p-3.75 text-left transition', mode === CustodyFeeMode.None ? 'border-[1.5px] border-primary bg-primary-soft/40' : 'border-line'].join(' ')}
          >
            <div className="flex items-center gap-2.75">
              <span className={['flex size-4.5 flex-none items-center justify-center rounded-full border-2', mode === CustodyFeeMode.None ? 'border-primary' : 'border-line'].join(' ')}>
                {mode === CustodyFeeMode.None && <span className="size-2.25 rounded-full bg-primary" />}
              </span>
              <div className="text-[14px] font-bold text-ink">Aucun frais</div>
            </div>
          </button>
        </div>
      </div>

      <div className="mt-4.5 rounded-2xl bg-primary-deep p-4.5 text-white">
        <div className="mb-3 flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M2 9l3-3 3 2 5-5" stroke="#7FD8AE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-primary-bright text-[11px] font-extrabold tracking-[.06em] uppercase">Aperçu calculé</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex-1 text-[12.5px] leading-[1.5] font-medium text-primary-tint">
            Pour un client à <span className="num font-bold text-white">{Money.from(PREVIEW_AMOUNT_PER_DAY).format()}/jour</span> sur un cycle de{' '}
            <span className="num font-bold text-white">{cycleDays} jours</span> :
          </div>
          <div className="flex-none text-right">
            <div className="num text-[28px] leading-none font-bold text-white">{previewFee.toLocaleString('fr-FR')}</div>
            <div className="text-primary-bright mt-0.75 text-[11.5px] font-bold">FCFA de frais / cycle</div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-start gap-2.25 rounded-xl border border-line-soft bg-cream px-3.5 py-3">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="mt-px flex-none">
          <rect x="3" y="2.5" width="10" height="11" rx="1.6" stroke="#8A8A82" strokeWidth="1.3" />
          <path d="M5.5 6h5M5.5 8.5h5M5.5 11h3" stroke="#8A8A82" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
        <span className="text-[12px] leading-[1.45] font-medium text-ink-muted">
          Le client est informé du montant et du mode de calcul des frais <b>à l&rsquo;adhésion</b>. Modification tracée au Journal des changements.
        </span>
      </div>

      <div className="mt-5 flex gap-2.5">
        <Button variant="secondary" className="flex-1" onClick={close}>
          Annuler
        </Button>
        <Button variant="primary" className="flex-[1.4]" loading={submitting} onClick={handleSave}>
          Enregistrer
        </Button>
      </div>
    </Modal>
  );
};
