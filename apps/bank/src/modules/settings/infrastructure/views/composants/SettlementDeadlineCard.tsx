import React, { useState } from 'react';
import { Button } from '@miya/ui';
import type { CollectionRules } from '../../../domain/entities/BankSettings';
import { UpdateSettlementDeadlineAsync } from '../../../application/usecases/update-settlement-deadline-async/UpdateSettlementDeadlineAsync';
import { useBankDispatch } from '@/config/stores/root-hook/RootHook';
import { ImpactBanner } from './ImpactBanner';

interface SettlementDeadlineCardProps {
  rules: CollectionRules;
}

const toLabel = (hhmm: string): string => `avant ${hhmm.replace(':', 'h')}`;

/** Fenêtre de reversement — heure limite, édition inline. Maquette 9e. */
export const SettlementDeadlineCard: React.FC<SettlementDeadlineCardProps> = ({ rules }) => {
  const dispatch = useBankDispatch();
  const [isEditing, setEditing] = useState(false);
  const [deadline, setDeadline] = useState(rules.settlementDeadline);
  const [submitting, setSubmitting] = useState(false);

  const startEdit = (): void => {
    setDeadline(rules.settlementDeadline);
    setEditing(true);
  };
  const cancel = (): void => setEditing(false);
  const save = async (): Promise<void> => {
    setSubmitting(true);
    await dispatch(UpdateSettlementDeadlineAsync({ settlementDeadline: deadline }));
    setSubmitting(false);
    setEditing(false);
  };

  if (!isEditing) {
    return (
      <div className="flex items-center justify-between rounded-2xl border border-line bg-card px-4.5 py-4">
        <div>
          <div className="text-[13.5px] font-bold text-ink">Fenêtre de reversement</div>
          <div className="text-[12px] font-medium text-ink-faint">Clôture obligatoire de la journée</div>
        </div>
        <div className="flex items-center gap-3">
          <span className="num text-[15px] font-bold text-ink">{toLabel(rules.settlementDeadline)}</span>
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
          <div className="text-[15px] font-extrabold text-ink">Fenêtre de reversement</div>
          <div className="text-[12.5px] font-medium text-ink-faint">Heure limite de clôture de la journée</div>
        </div>
        <span className="bg-primary-soft rounded-full px-2.75 py-1 text-[11px] font-extrabold text-primary">En édition</span>
      </div>

      <div className="w-58">
        <div className="mb-1.75 text-[11.5px] font-bold text-ink">Heure limite</div>
        <input
          type="time"
          value={deadline}
          onChange={(event) => setDeadline(event.target.value)}
          className="num w-full rounded-xl border-[1.5px] border-primary bg-card px-3.5 py-2.75 text-[18px] font-bold text-ink outline-none"
        />
        <div className="mt-2 text-[11.5px] font-semibold text-ink-faint">
          Actuel <span className="num line-through">{rules.settlementDeadline}</span>
        </div>
      </div>

      <ImpactBanner
        title="S'applique dès la prochaine journée de collecte"
        detail="Les journées déjà ouvertes gardent la fenêtre actuelle."
      />

      <div className="mt-4 flex justify-end gap-2.5">
        <Button variant="secondary" onClick={cancel}>
          Annuler
        </Button>
        <Button variant="primary" onClick={save} loading={submitting} disabled={!deadline}>
          Enregistrer
        </Button>
      </div>
    </div>
  );
};
