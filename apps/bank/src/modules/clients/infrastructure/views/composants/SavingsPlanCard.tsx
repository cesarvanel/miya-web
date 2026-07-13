import React from 'react';
import { Gauge } from '@miya/ui';
import { Money } from '@miya/kernel';
import type { Client } from '../../../domain/entities/Client';
import type { SavingsProgress } from '../../../domain/selectors/Selectors';
import { DAY_OF_WEEK_ORDER, DAY_OF_WEEK_SHORT_LABEL } from '../../../domain/entities/SavingsPlan';

interface SavingsPlanCardProps {
  client: Client;
  progress: SavingsProgress;
}

const formatDate = (iso: string): string =>
  new Date(`${iso}T00:00:00`).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

/** Rythme (jours cochés), objectif avec jauge de progression, échéance de l'engagement. */
export const SavingsPlanCard: React.FC<SavingsPlanCardProps> = ({ client, progress }) => {
  const { savingsPlan } = client;

  return (
    <div className="space-y-4">
      <div className="rounded-card-lg bg-primary-deep p-6 text-white">
        <div className="text-primary-bright text-[12.5px] font-bold tracking-[.06em] uppercase">
          Solde d&rsquo;épargne
        </div>
        <div className="num mt-1.5 text-[42px] leading-tight font-bold tracking-[-0.02em]">
          {Money.from(client.savingsBalance).format()}
        </div>
        <div className="mt-2.5 flex gap-5">
          <div>
            <div className="text-[11.5px] font-semibold text-primary-muted">Cotisation par jour</div>
            <div className="num text-[15px] font-bold">{Money.from(savingsPlan.amountPerCollectionDay).format()}</div>
          </div>
          <div>
            <div className="text-[11.5px] font-semibold text-primary-muted">Fin d&rsquo;engagement</div>
            <div className="text-[15px] font-bold">{formatDate(savingsPlan.engagement.endDate)}</div>
          </div>
        </div>
      </div>

      <div className="rounded-card-lg border border-line bg-card p-5">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[13px] font-extrabold text-ink">Rythme de cotisation</span>
          <span className="text-[11.5px] font-semibold text-ink-faint">
            {savingsPlan.computed.plannedCollectionDays} jours prévus
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {DAY_OF_WEEK_ORDER.map((day) => {
            const active = savingsPlan.collectionDays.includes(day);
            return (
              <span
                key={day}
                className={[
                  'rounded-lg px-2.5 py-1.5 text-[11.5px] font-bold',
                  active ? 'bg-primary-soft text-primary' : 'bg-cream-100 text-ink-faint',
                ].join(' ')}
              >
                {DAY_OF_WEEK_SHORT_LABEL[day]}
              </span>
            );
          })}
        </div>

        <div className="mt-4">
          <Gauge
            value={progress.balance}
            max={progress.target}
            warnRatio={1.1}
            label="Objectif d'épargne"
            hint={`${Math.round(progress.ratio * 100)}% atteint · objectif indicatif`}
          />
        </div>
      </div>
    </div>
  );
};
