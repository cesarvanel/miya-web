import React, { useState } from 'react';
import { Button, Modal } from '@miya/ui';
import { Money } from '@miya/kernel';
import { usePlatformDispatch, usePlatformSelector } from '@/config/root-hook';
import { useModal } from '@/shared/modals';
import { ChangePlanAsync } from '../../../application/usecases/change-plan-async/ChangePlanAsync';
import { selectTenantById } from '../../../domain/selectors/Selectors';
import { PLAN_CATALOG } from '../../fixtures/tenantFixtures';

/** Changement de plan — comparatif ancien/nouveau, effectif au prochain cycle. Maquette 2f (action « Changer de plan »). */
export const ChangePlanModal: React.FC = () => {
  const { isOpen, props, close } = useModal('changePlan');
  const dispatch = usePlatformDispatch();
  const tenant = usePlatformSelector((state) => (props ? selectTenantById(state, props.tenantId) : undefined));
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !tenant) {
    return null;
  }

  const targetPlanId = selectedPlanId ?? tenant.plan.id;
  const targetEntry = PLAN_CATALOG[targetPlanId];
  const hasChange = targetPlanId !== tenant.plan.id;

  const handleClose = (): void => {
    setSelectedPlanId(null);
    close();
  };

  const handleConfirm = async (): Promise<void> => {
    if (!hasChange || submitting) {
      return;
    }
    setSubmitting(true);
    await dispatch(ChangePlanAsync({ tenantId: tenant.id, planId: targetPlanId }));
    setSubmitting(false);
    setSelectedPlanId(null);
    close();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      ariaLabel={`Changer le plan de ${tenant.name}`}
      width={520}
      header={
        <div>
          <div className="text-lg font-extrabold tracking-[-0.01em] text-ink">Changer de plan</div>
          <div className="mt-0.5 text-[12.5px] font-medium text-ink-muted">{tenant.name}</div>
        </div>
      }
      footer={
        <div className="flex gap-2.5">
          <Button variant="secondary" onClick={handleClose} className="flex-1">
            Annuler
          </Button>
          <Button variant="primary" onClick={handleConfirm} loading={submitting} disabled={!hasChange} className="flex-[1.4]">
            Confirmer le changement
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-2">
        {Object.values(PLAN_CATALOG).map(({ plan, limits }) => {
          const isCurrent = plan.id === tenant.plan.id;
          const isSelected = plan.id === targetPlanId;
          return (
            <button
              key={plan.id}
              type="button"
              onClick={() => setSelectedPlanId(plan.id)}
              className={[
                'flex cursor-pointer items-center justify-between rounded-2xl border p-3.5 text-left transition',
                isSelected ? 'border-[2px] border-admin-primary bg-[#F4FAF7]' : 'border-line bg-card hover:bg-cream-50',
              ].join(' ')}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className={['text-[14px] font-bold', isSelected ? 'text-admin-primary' : 'text-ink'].join(' ')}>{plan.name}</span>
                  {isCurrent && <span className="rounded-full bg-cream-100 px-2 py-0.5 text-[10.5px] font-bold text-ink-faint">Plan actuel</span>}
                </div>
                <div className="num mt-0.5 text-[12px] font-semibold text-ink-faint">
                  {limits.agents.limit} agents · {limits.clients.limit.toLocaleString('fr-FR')} clients · {limits.agencies.limit} agences
                </div>
              </div>
              <span className="num text-[15px] font-bold text-ink">{Money.from(plan.monthlyPrice).format()}/mois</span>
            </button>
          );
        })}
      </div>

      {hasChange && targetEntry && (
        <div className="mt-4 rounded-[14px] bg-amber-soft px-4 py-3.5 text-[12.5px] font-semibold text-amber-deep">
          Nouveau plan effectif au prochain cycle de facturation — {tenant.plan.name} reste actif jusqu&rsquo;à l&rsquo;échéance en cours.
        </div>
      )}
    </Modal>
  );
};
