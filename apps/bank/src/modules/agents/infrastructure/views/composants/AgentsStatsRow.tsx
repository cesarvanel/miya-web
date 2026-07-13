import React from 'react';
import { Money } from '@miya/kernel';

interface AgentsStatsRowProps {
  activeCount: number;
  totalCount: number;
  totalCollected: number;
  averageConfirmationRate: number;
  devicesToReactivateCount: number;
}

/** 4 tuiles KPI — fidèle à la maquette 7a (chiffres calculés depuis le seed, pas les valeurs littérales de la maquette). */
export const AgentsStatsRow: React.FC<AgentsStatsRowProps> = ({
  activeCount,
  totalCount,
  totalCollected,
  averageConfirmationRate,
  devicesToReactivateCount,
}) => (
  <div className="mb-4.5 grid grid-cols-4 gap-4">
    <div className="rounded-card-lg shadow-primary-glow bg-primary p-4.5 text-white">
      <div className="text-primary-tint text-[12.5px] font-semibold">Actifs aujourd&rsquo;hui</div>
      <div className="num mt-2 text-[28px] leading-none font-bold">
        {activeCount}
        <span className="text-primary-muted text-[18px]">/{totalCount}</span>
      </div>
      <div className="text-primary-tint mt-1 text-[11.5px] font-medium">en tournée ou agence</div>
    </div>
    <div className="rounded-card-lg border border-line bg-card p-4.5">
      <div className="text-[12.5px] font-semibold text-ink-muted">Collecté ce mois</div>
      <div className="num mt-2 text-[28px] leading-none font-bold text-ink">{Money.from(totalCollected).format()}</div>
      <div className="mt-1 text-[11.5px] font-medium text-ink-faint">tous agents</div>
    </div>
    <div className="rounded-card-lg border border-line bg-card p-4.5">
      <div className="text-[12.5px] font-semibold text-ink-muted">Taux de confirmation</div>
      <div className="num text-primary mt-2 text-[28px] leading-none font-bold">
        {averageConfirmationRate.toFixed(1).replace('.', ',')}%
      </div>
      <div className="mt-1 text-[11.5px] font-medium text-ink-faint">saisies validées</div>
    </div>
    <div
      className={[
        'rounded-card-lg border p-4.5',
        devicesToReactivateCount > 0 ? 'border-[1.5px] border-danger/40 bg-card' : 'border-line bg-card',
      ].join(' ')}
    >
      <div className={['text-[12.5px] font-semibold', devicesToReactivateCount > 0 ? 'text-danger' : 'text-ink-muted'].join(' ')}>
        Appareils à réactiver
      </div>
      <div className={['num mt-2 text-[28px] leading-none font-bold', devicesToReactivateCount > 0 ? 'text-danger' : 'text-ink'].join(' ')}>
        {devicesToReactivateCount}
      </div>
      <div className={['mt-1 text-[11.5px] font-medium', devicesToReactivateCount > 0 ? 'text-danger/80' : 'text-ink-faint'].join(' ')}>
        appareil révoqué
      </div>
    </div>
  </div>
);
