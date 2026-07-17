import React, { useEffect, useState } from 'react';
import { AmountInput, Button, Modal, formatAmount, parseAmount } from '@miya/ui';
import { usePlatformDispatch, usePlatformSelector } from '@/config/root-hook';
import { useModal } from '@/shared/modals';
import { UpdatePlanAsync } from '../../../application/usecases/update-plan-async/UpdatePlanAsync';
import { BillingSelectors } from '../../../domain/selectors/Selectors';

interface LimitFieldProps {
  label: string;
  /** `null` = illimité — vide le champ pour l'exprimer. */
  value: number | null;
  onChange: (value: number | null) => void;
}

const LimitField: React.FC<LimitFieldProps> = ({ label, value, onChange }) => (
  <div>
    <label className="text-xs font-bold text-ink">{label}</label>
    <div className="mt-1.5 rounded-input flex items-center justify-between border border-line bg-card px-3 py-2.75">
      <input
        type="text"
        inputMode="numeric"
        placeholder="Illimité"
        value={value === null ? '' : formatAmount(value)}
        onChange={(event) => onChange(parseAmount(event.target.value))}
        className="num w-full border-none bg-transparent text-[15px] font-bold text-ink outline-none placeholder:text-ink-soft placeholder:text-xs placeholder:font-semibold"
      />
    </div>
  </div>
);

/** Édition d'un plan — tarif + 3 limites, bannière d'impact avant confirmation. Effet au prochain cycle. Maquette 3b. */
export const EditPlanModal: React.FC = () => {
  const { isOpen, props, close } = useModal('editPlan');
  const dispatch = usePlatformDispatch();
  const plan = usePlatformSelector((state) => (props ? BillingSelectors.selectPlanById(state, props.planId) : undefined));

  const [monthlyPrice, setMonthlyPrice] = useState<number | null>(null);
  const [agents, setAgents] = useState<number | null>(null);
  const [clients, setClients] = useState<number | null>(null);
  const [agencies, setAgencies] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (plan) {
      setMonthlyPrice(plan.monthlyPrice);
      setAgents(plan.limits.agents);
      setClients(plan.limits.clients);
      setAgencies(plan.limits.agencies);
    }
  }, [plan]);

  if (!isOpen || !plan) {
    return null;
  }

  const canSubmit = monthlyPrice !== null && agencies !== null && !submitting;

  const handleClose = (): void => {
    close();
  };

  const handleConfirm = async (): Promise<void> => {
    if (!canSubmit || monthlyPrice === null || agencies === null) {
      return;
    }
    setSubmitting(true);
    await dispatch(
      UpdatePlanAsync({
        planId: plan.id,
        monthlyPrice,
        limits: { agents, clients, agencies },
      }),
    );
    setSubmitting(false);
    close();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      ariaLabel={`Modifier le plan ${plan.name}`}
      width={520}
      header={
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-primary-soft px-3 py-1.25 text-xs font-bold text-primary">{plan.name}</span>
          <div className="text-[19px] font-extrabold tracking-[-0.01em] text-ink">Modifier le plan</div>
        </div>
      }
      footer={
        <div className="flex items-center gap-2.5">
          <span className="mr-auto text-xs font-semibold text-ink-faint">Effet au prochain cycle de facturation</span>
          <Button variant="secondary" onClick={handleClose}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleConfirm} loading={submitting} disabled={!canSubmit}>
            Confirmer le changement
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <div>
          <label className="text-[12.5px] font-bold text-ink">Tarif mensuel (FCFA)</label>
          <div className="mt-1.5">
            <AmountInput value={monthlyPrice} onChange={setMonthlyPrice} aria-label="Tarif mensuel" />
          </div>
          {monthlyPrice !== null && monthlyPrice !== plan.monthlyPrice && (
            <div className="mt-1.5 text-[11.5px] font-semibold text-amber">
              Ancien tarif : <span className="num">{plan.monthlyPrice.toLocaleString('fr-FR')}</span> FCFA —{' '}
              {monthlyPrice > plan.monthlyPrice ? 'hausse' : 'baisse'} de{' '}
              <span className="num">{Math.abs(Math.round(((monthlyPrice - plan.monthlyPrice) / plan.monthlyPrice) * 1000) / 10)}%</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3">
          <LimitField label="Agents max" value={agents} onChange={setAgents} />
          <LimitField label="Clients max" value={clients} onChange={setClients} />
          <LimitField label="Agences max" value={agencies} onChange={setAgencies} />
        </div>

        {plan.tenantsCount > 0 && (
          <div className="rounded-[14px] border border-amber-border bg-amber-soft px-4 py-3.5 text-[12.5px] leading-[1.55] font-medium text-amber-deep">
            <b>
              {plan.tenantsCount} banque{plan.tenantsCount > 1 ? 's sont actuellement' : ' est actuellement'} sur ce plan.
            </b>{' '}
            Le changement de tarif et de limites s&rsquo;appliquera à leur prochain cycle de facturation — les factures déjà
            émises ne sont pas modifiées. Les banques concernées seront notifiées par e-mail.
          </div>
        )}
      </div>
    </Modal>
  );
};
