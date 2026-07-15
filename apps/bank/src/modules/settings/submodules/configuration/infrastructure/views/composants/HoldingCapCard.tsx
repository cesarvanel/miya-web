import React, { useState } from 'react';
import { AmountInput, Button } from '@miya/ui';
import { Money } from '@miya/kernel';
import { CapBehavior, type CollectionRules } from '../../../domain/entities/BankSettings';
import { UpdateHoldingCapAsync } from '../../../application/usecases/update-holding-cap-async/UpdateHoldingCapAsync';
import { useBankDispatch } from '@/config/stores/root-hook/RootHook';
import { ImpactBanner } from './ImpactBanner';

interface HoldingCapCardProps {
  rules: CollectionRules;
}

/** Plafond de détention par agent — édition inline. Maquette 9d. */
export const HoldingCapCard: React.FC<HoldingCapCardProps> = ({ rules }) => {
  const dispatch = useBankDispatch();
  const [isEditing, setEditing] = useState(false);
  const [holdingCap, setHoldingCap] = useState<number | null>(rules.holdingCap);
  const [capBehavior, setCapBehavior] = useState<CapBehavior>(rules.capBehavior);
  const [submitting, setSubmitting] = useState(false);

  const startEdit = (): void => {
    setHoldingCap(rules.holdingCap);
    setCapBehavior(rules.capBehavior);
    setEditing(true);
  };

  const cancel = (): void => setEditing(false);

  const save = async (): Promise<void> => {
    if (holdingCap === null || holdingCap <= 0) {
      return;
    }
    setSubmitting(true);
    await dispatch(UpdateHoldingCapAsync({ holdingCap, capBehavior }));
    setSubmitting(false);
    setEditing(false);
  };

  if (!isEditing) {
    return (
      <div className="flex items-center justify-between rounded-2xl border border-line bg-card px-4.5 py-4">
        <div>
          <div className="text-[13.5px] font-bold text-ink">Plafond de détention par agent</div>
          <div className="text-[12px] font-medium text-ink-faint">Au-delà, un dépôt partiel est obligatoire</div>
        </div>
        <div className="flex items-center gap-3">
          <span className="num text-[15px] font-bold text-ink">{Money.from(rules.holdingCap).format()}</span>
          <button type="button" onClick={startEdit} className="cursor-pointer text-xs font-bold text-primary hover:underline">
            Modifier
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border-2 border-primary bg-card p-5 shadow-primary-glow">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="text-[15px] font-extrabold text-ink">Plafond de détention par agent</div>
          <div className="text-[12.5px] font-medium text-ink-faint">Au-delà, un dépôt partiel devient obligatoire</div>
        </div>
        <span className="bg-primary-soft rounded-full px-2.75 py-1 text-[11px] font-extrabold text-primary">En édition</span>
      </div>

      <div className="flex items-start gap-6">
        <div className="w-65 flex-none">
          <div className="mb-1.75 text-[11.5px] font-bold text-ink">Montant du plafond</div>
          <AmountInput value={holdingCap} onChange={setHoldingCap} aria-label="Montant du plafond" />
          <div className="mt-2 text-[11.5px] font-semibold text-ink-faint">
            Actuel <span className="num line-through">{rules.holdingCap.toLocaleString('fr-FR')}</span>
          </div>
        </div>
        <div className="flex-1">
          <div className="mb-1.75 text-[11.5px] font-bold text-ink">Comportement au seuil</div>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => setCapBehavior(CapBehavior.Recommend)}
              className={[
                'flex items-start gap-2.75 rounded-xl border p-3.25 text-left transition',
                capBehavior === CapBehavior.Recommend ? 'border-primary bg-primary-soft' : 'border-line',
              ].join(' ')}
            >
              <span className={['mt-0.5 flex size-4.5 flex-none items-center justify-center rounded-full border-2', capBehavior === CapBehavior.Recommend ? 'border-primary' : 'border-line'].join(' ')}>
                {capBehavior === CapBehavior.Recommend && <span className="size-2.25 rounded-full bg-primary" />}
              </span>
              <span>
                <div className="text-[13.5px] font-bold text-ink">Recommandation — l&rsquo;agent est alerté</div>
                <div className="text-[12px] font-medium text-ink-muted">Une alerte l&rsquo;invite à faire un dépôt partiel, sans le bloquer.</div>
              </span>
            </button>
            <button
              type="button"
              onClick={() => setCapBehavior(CapBehavior.Block)}
              className={[
                'flex items-start gap-2.75 rounded-xl border p-3.25 text-left transition',
                capBehavior === CapBehavior.Block ? 'border-primary bg-primary-soft' : 'border-line',
              ].join(' ')}
            >
              <span className={['mt-0.5 flex size-4.5 flex-none items-center justify-center rounded-full border-2', capBehavior === CapBehavior.Block ? 'border-primary' : 'border-line'].join(' ')}>
                {capBehavior === CapBehavior.Block && <span className="size-2.25 rounded-full bg-primary" />}
              </span>
              <span>
                <div className="text-[13.5px] font-bold text-ink">Blocage — collecte impossible sans dépôt</div>
                <div className="text-[12px] font-medium text-ink-muted">L&rsquo;agent ne peut plus encaisser tant qu&rsquo;un dépôt partiel n&rsquo;est pas fait.</div>
              </span>
            </button>
          </div>
        </div>
      </div>

      <ImpactBanner
        title="Ce changement s'appliquera aux prochaines journées de collecte, pas aux journées ouvertes"
        detail="Les tournées en cours aujourd'hui gardent l'ancien plafond."
      />

      <div className="mt-4 flex justify-end gap-2.5">
        <Button variant="secondary" onClick={cancel}>
          Annuler
        </Button>
        <Button variant="primary" onClick={save} loading={submitting} disabled={holdingCap === null || holdingCap <= 0}>
          Enregistrer
        </Button>
      </div>
    </div>
  );
};
