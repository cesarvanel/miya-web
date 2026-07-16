import React, { useState } from 'react';
import { AmountInput, Button, Dropdown, Modal } from '@miya/ui';
import { useBankDispatch, useBankSelector } from '@/config/stores/root-hook/RootHook';
import { useModal } from '@/shared/modals';
import { ContributionPlanStatus } from '../../../domain/entities/BankSettings';
import { selectContributionPlans } from '../../../domain/selectors/Selectors';
import { DeactivatePlanAsync } from '../../../application/usecases/deactivate-plan-async/DeactivatePlanAsync';
import { UpsertPlanAsync } from '../../../application/usecases/upsert-plan-async/UpsertPlanAsync';

const FREQUENCY_OPTIONS = [
  { value: 'Journalier', label: 'Journalier' },
  { value: 'Tous les 2 jours', label: 'Tous les 2 jours' },
  { value: 'Hebdomadaire', label: 'Hebdomadaire' },
];

export const ManagePlansModal: React.FC = () => {
  const { isOpen, close } = useModal('managePlans');
  const dispatch = useBankDispatch();
  const plans = useBankSelector(selectContributionPlans);

  const [deactivatingPlanId, setDeactivatingPlanId] = useState<string | null>(null);
  const [deactivating, setDeactivating] = useState(false);

  const [newAmount, setNewAmount] = useState<number | null>(3_000);
  const [newFrequency, setNewFrequency] = useState('Hebdomadaire');
  const [adding, setAdding] = useState(false);

  if (!isOpen) {
    return null;
  }

  const activePlans = plans.filter((plan) => plan.status === ContributionPlanStatus.Active);

  const confirmDeactivate = async (planId: string): Promise<void> => {
    setDeactivating(true);
    await dispatch(DeactivatePlanAsync({ planId }));
    setDeactivating(false);
    setDeactivatingPlanId(null);
  };

  const addPlan = async (): Promise<void> => {
    if (newAmount === null || newAmount <= 0) {
      return;
    }
    setAdding(true);
    await dispatch(UpsertPlanAsync({ floorAmount: newAmount, frequencyLabel: newFrequency }));
    setAdding(false);
    setNewAmount(3_000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={close}
      ariaLabel="Plans de cotisation"
      width={640}
      header={
        <>
          <div className="text-lg font-extrabold text-ink">Plans de cotisation</div>
          <div className="mt-1 text-[12.5px] font-medium text-ink-muted">Montants proposés à l&rsquo;enregistrement d&rsquo;un client</div>
        </>
      }
      footer={
        <div className="flex items-center justify-between gap-2.5">
          <span className="text-[11.5px] font-semibold text-ink-faint">Chaque modification est tracée au Journal des changements.</span>
          <Button variant="secondary" onClick={close}>
            Terminé
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-2.5">
        {activePlans.map((plan) => (
          <div key={plan.id} className={['rounded-2xl border', plan.isDefault ? 'border-[1.5px] border-primary/40 bg-primary-soft/40' : 'border-line'].join(' ')}>
            <div className="flex items-center gap-3.5 px-4 py-3.25">
              <div className="w-19.5 flex-none">
                <span className={['num text-[17px] font-bold', plan.isDefault ? 'text-primary' : 'text-ink'].join(' ')}>
                  {plan.floorAmount.toLocaleString('fr-FR')}
                </span>
                <span className="ml-1 text-[11px] font-semibold text-ink-faint"> FCFA</span>
              </div>
              <span className="rounded-full bg-cream-100 px-2.5 py-1 text-xs font-bold text-ink-muted">{plan.frequencyLabel}</span>
              <div className="flex flex-1 items-center gap-2">
                <span className="num text-[12.5px] font-semibold text-ink-faint">{plan.clientsCount} clients</span>
                {plan.isDefault && (
                  <span className="bg-primary-soft rounded-full px-2.25 py-0.5 text-[10.5px] font-extrabold text-primary">Le plus courant</span>
                )}
              </div>
              <button type="button" className="cursor-pointer text-xs font-bold text-primary hover:underline">
                Modifier
              </button>
              <button
                type="button"
                onClick={() => setDeactivatingPlanId(plan.id)}
                disabled={plan.isDefault}
                className="cursor-pointer text-xs font-bold text-danger hover:underline disabled:cursor-not-allowed disabled:text-ink-disabled disabled:no-underline"
              >
                Désactiver
              </button>
            </div>

            {deactivatingPlanId === plan.id && (
              <div className="flex items-start gap-2.5 rounded-b-2xl bg-danger-soft px-4 py-3.5">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" className="mt-px flex-none">
                  <circle cx="9" cy="9" r="6.5" stroke="#C43B32" strokeWidth="1.5" />
                  <path d="M9 5.5v4M9 11.5h.01" stroke="#C43B32" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <div className="flex-1">
                  <div className="text-[13px] font-extrabold text-danger">Désactiver ce plan ?</div>
                  <div className="mt-0.5 text-[12.5px] leading-[1.45] font-medium text-danger">
                    <b>{plan.clientsCount} clients utilisent ce plan</b> — il restera actif pour eux, mais ne sera plus proposé aux nouveaux clients. Un plan utilisé ne peut pas être supprimé.
                  </div>
                  <div className="mt-2.75 flex gap-2.25">
                    <Button variant="secondary" size="sm" onClick={() => setDeactivatingPlanId(null)}>
                      Annuler
                    </Button>
                    <Button variant="destructive" size="sm" loading={deactivating} onClick={() => confirmDeactivate(plan.id)}>
                      Désactiver pour les nouveaux
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        <div className="border-primary/40 bg-primary-soft/20 mt-1 rounded-2xl border-[1.5px] border-dashed p-4">
          <div className="mb-2.75 text-xs font-extrabold text-ink">Ajouter un plan</div>
          <div className="flex items-end gap-2.5">
            <div className="flex-1">
              <div className="mb-1.5 text-[10.5px] font-bold tracking-[.04em] text-ink-faint uppercase">Montant</div>
              <AmountInput value={newAmount} onChange={setNewAmount} aria-label="Montant du nouveau plan" />
            </div>
            <div className="flex-1">
              <div className="mb-1.5 text-[10.5px] font-bold tracking-[.04em] text-ink-faint uppercase">Fréquence</div>
              <Dropdown options={FREQUENCY_OPTIONS} value={newFrequency} onChange={setNewFrequency} aria-label="Fréquence du nouveau plan" />
            </div>
            <Button variant="primary" onClick={addPlan} loading={adding} disabled={newAmount === null || newAmount <= 0}>
              Ajouter
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
