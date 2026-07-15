import React from 'react';
import { Card } from '@miya/ui';
import { Money } from '@miya/kernel';
import type { ContributionPlan } from '../../../domain/entities/BankSettings';

interface PlansCardProps {
  plans: ContributionPlan[];
  onManage: () => void;
}

/** Plans de cotisation — chips des montants actifs, « Gérer » ouvre la modale de gestion. Maquette 9a. */
export const PlansCard: React.FC<PlansCardProps> = ({ plans, onManage }) => {
  const activePlans = plans.filter((plan) => plan.status === 'Active');

  return (
    <Card>
      <div id="settings-section-plans" className="mb-4 flex items-center justify-between">
        <div>
          <div className="text-[16px] font-extrabold text-ink">Plans de cotisation</div>
          <div className="text-[12.5px] font-medium text-ink-faint">Montants journaliers proposés à l&rsquo;enregistrement</div>
        </div>
        <button type="button" onClick={onManage} className="cursor-pointer text-xs font-bold text-primary hover:underline">
          Gérer
        </button>
      </div>
      <div className="flex flex-wrap gap-2.5">
        {activePlans.map((plan) => (
          <div
            key={plan.id}
            className={[
              'rounded-2xl border px-4.5 py-3 text-center',
              plan.isDefault ? 'border-primary/40 bg-primary-soft' : 'border-line bg-cream-50',
            ].join(' ')}
          >
            <div className={['num text-[18px] font-bold', plan.isDefault ? 'text-primary' : 'text-ink'].join(' ')}>
              {Money.from(plan.floorAmount).format().replace(' FCFA', '')}
            </div>
            <div className={['text-[11px] font-semibold', plan.isDefault ? 'text-primary' : 'text-ink-faint'].join(' ')}>
              {plan.isDefault ? 'le plus courant' : 'FCFA/jour'}
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={onManage}
          className="flex cursor-pointer items-center gap-1.5 rounded-2xl border-[1.5px] border-dashed border-line px-4.5 py-3 text-[12.5px] font-bold text-ink-faint hover:border-primary/40 hover:text-primary"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M7 3v8M3 7h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          Ajouter
        </button>
      </div>
    </Card>
  );
};
