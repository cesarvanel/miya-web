import React, { useState } from 'react';
import { AmountInput, Button } from '@miya/ui';
import type { CollectionRules } from '../../../domain/entities/BankSettings';
import { UpdateCollectionRulesAsync } from '../../../application/usecases/update-collection-rules-async/UpdateCollectionRulesAsync';
import { useBankDispatch } from '@/config/stores/root-hook/RootHook';
import { ImpactBanner } from './ImpactBanner';

interface CollectionRulesRestCardProps {
  rules: CollectionRules;
}

interface RuleRowProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const RuleRow: React.FC<RuleRowProps> = ({ title, description, children }) => (
  <div className="flex items-start justify-between gap-5 rounded-2xl border border-line bg-card p-5">
    <div className="flex-1">
      <div className="text-[15px] font-extrabold text-ink">{title}</div>
      <div className="mt-0.5 text-[12.5px] leading-[1.45] font-medium text-ink-faint">{description}</div>
    </div>
    <div className="flex-none">{children}</div>
  </div>
);

/** Auto-validation, fenêtre de contestation, tolérance d'écart — édition inline groupée. Maquette 9f. */
export const CollectionRulesRestCard: React.FC<CollectionRulesRestCardProps> = ({ rules }) => {
  const dispatch = useBankDispatch();
  const [isEditing, setEditing] = useState(false);
  const [autoValidationDelayHours, setAutoValidationDelayHours] = useState(rules.autoValidationDelayHours);
  const [disputeWindowHours, setDisputeWindowHours] = useState(rules.disputeWindowHours);
  const [gapTolerance, setGapTolerance] = useState<number | null>(rules.gapTolerance);
  const [submitting, setSubmitting] = useState(false);

  const startEdit = (): void => {
    setAutoValidationDelayHours(rules.autoValidationDelayHours);
    setDisputeWindowHours(rules.disputeWindowHours);
    setGapTolerance(rules.gapTolerance);
    setEditing(true);
  };
  const cancel = (): void => setEditing(false);
  const save = async (): Promise<void> => {
    if (gapTolerance === null) {
      return;
    }
    setSubmitting(true);
    await dispatch(UpdateCollectionRulesAsync({ autoValidationDelayHours, disputeWindowHours, gapTolerance }));
    setSubmitting(false);
    setEditing(false);
  };

  if (!isEditing) {
    return (
      <div className="flex flex-col gap-3">
        <RuleRow title="Délai d'auto-validation d'une collecte" description="Passé ce délai sans confirmation du client, la collecte est validée automatiquement.">
          <div className="flex items-center gap-3">
            <span className="num text-[15px] font-bold text-ink">{rules.autoValidationDelayHours} h</span>
            <button type="button" onClick={startEdit} className="cursor-pointer text-xs font-bold text-primary hover:underline">
              Modifier
            </button>
          </div>
        </RuleRow>
        <RuleRow title="Fenêtre de contestation" description="Durée pendant laquelle un client peut contester une collecte après sa notification.">
          <div className="flex items-center gap-3">
            <span className="num text-[15px] font-bold text-ink">{rules.disputeWindowHours} h</span>
            <button type="button" onClick={startEdit} className="cursor-pointer text-xs font-bold text-primary hover:underline">
              Modifier
            </button>
          </div>
        </RuleRow>
        <RuleRow title="Tolérance d'écart au rapprochement" description="Écart maximal accepté entre le cash déclaré et le cash compté sans blocage.">
          <div className="flex items-center gap-3">
            <span className="num text-[15px] font-bold text-ink">{rules.gapTolerance.toLocaleString('fr-FR')} FCFA</span>
            <button type="button" onClick={startEdit} className="cursor-pointer text-xs font-bold text-primary hover:underline">
              Modifier
            </button>
          </div>
        </RuleRow>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border-2 border-primary bg-card p-5 shadow-primary-glow">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-[15px] font-extrabold text-ink">Auto-validation, contestation &amp; tolérance</div>
        <span className="bg-primary-soft rounded-full px-2.75 py-1 text-[11px] font-extrabold text-primary">En édition</span>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-5">
          <div>
            <div className="text-[13.5px] font-bold text-ink">Délai d&rsquo;auto-validation</div>
            <div className="text-[12px] font-medium text-ink-faint">Le client est notifié par SMS.</div>
          </div>
          <div className="flex items-center gap-2 rounded-xl border-[1.5px] border-primary px-3.5 py-2.25">
            <input
              type="number"
              min={1}
              value={autoValidationDelayHours}
              onChange={(event) => setAutoValidationDelayHours(Math.max(1, Number(event.target.value)))}
              className="num w-14 border-none bg-transparent text-right text-[16px] font-bold text-ink outline-none"
            />
            <span className="text-[12.5px] font-semibold text-ink-faint">heures</span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-5">
          <div>
            <div className="text-[13.5px] font-bold text-ink">Fenêtre de contestation</div>
            <div className="text-[12px] font-medium text-ink-faint">Entre 24 h et 72 h.</div>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={24}
              max={72}
              step={4}
              value={disputeWindowHours}
              onChange={(event) => setDisputeWindowHours(Number(event.target.value))}
              className="accent-primary w-40"
            />
            <span className="num w-12 text-right text-[15px] font-bold text-primary">{disputeWindowHours} h</span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-5">
          <div>
            <div className="text-[13.5px] font-bold text-ink">Tolérance d&rsquo;écart</div>
            <div className="text-[12px] font-medium text-ink-faint">Tout écart toléré reste tracé et motivé.</div>
          </div>
          <AmountInput value={gapTolerance} onChange={setGapTolerance} aria-label="Tolérance d'écart" />
        </div>
      </div>

      <ImpactBanner
        title="Ces règles s'appliqueront aux prochaines collectes"
        detail="Les collectes déjà en cours de validation ne sont pas affectées."
      />

      <div className="mt-4 flex justify-end gap-2.5">
        <Button variant="secondary" onClick={cancel}>
          Annuler
        </Button>
        <Button variant="primary" onClick={save} loading={submitting} disabled={gapTolerance === null}>
          Enregistrer les règles
        </Button>
      </div>
    </div>
  );
};
