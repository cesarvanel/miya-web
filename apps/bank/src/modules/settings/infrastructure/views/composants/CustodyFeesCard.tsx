import React from 'react';
import { Card } from '@miya/ui';
import { CustodyFeeMode, type CustodyFees } from '../../../domain/entities/BankSettings';

interface CustodyFeesCardProps {
  custodyFees: CustodyFees;
  onEdit: () => void;
}

/** Frais de garde — résumé lecture seule, « Modifier » ouvre la modale. Maquette 9a. */
export const CustodyFeesCard: React.FC<CustodyFeesCardProps> = ({ custodyFees, onEdit }) => {
  const summary =
    custodyFees.mode === CustodyFeeMode.OnePerCycle
      ? { value: '1', unit: `cotisation / ${custodyFees.cycleDays ?? '—'} j`, detail: `Soit l'équivalent d'un jour de cotisation, retenu par cycle de ${custodyFees.cycleDays ?? '—'} jours.` }
      : custodyFees.mode === CustodyFeeMode.Percentage
        ? { value: `${custodyFees.percentage ?? 0}`, unit: '%', detail: 'Pourcentage du montant collecté sur le cycle.' }
        : { value: '0', unit: 'FCFA', detail: 'Aucun frais de garde prélevé.' };

  return (
    <Card>
      <div id="settings-section-custody" className="flex items-center justify-between">
        <div>
          <div className="text-[16px] font-extrabold text-ink">Frais de garde</div>
          <div className="text-[12.5px] font-medium text-ink-faint">Prélevés mensuellement</div>
        </div>
        <button type="button" onClick={onEdit} className="cursor-pointer text-xs font-bold text-primary hover:underline">
          Modifier
        </button>
      </div>
      <div className="mt-3.5 flex items-baseline gap-1.5">
        <span className="num text-[26px] font-bold text-ink">{summary.value}</span>
        <span className="text-[13px] font-semibold text-ink-muted">{summary.unit}</span>
      </div>
      <div className="mt-2 text-[12.5px] leading-[1.5] font-medium text-ink-faint">{summary.detail}</div>
    </Card>
  );
};
