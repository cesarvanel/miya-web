import React from 'react';
import { Gauge } from '@miya/ui';
import { Money } from '@miya/kernel';
import type { SettlementSlip } from '@/modules/settlements/domain/entities/SettlementSlip';
import { StatusTile } from './StatusTile';

interface PartialDepositBodyProps {
  slip: SettlementSlip;
}

/** Corps du détail d'un dépôt partiel de mi-journée — plafond, montant demandé, avancement. */
export const PartialDepositBody: React.FC<PartialDepositBodyProps> = ({ slip }) => {
  const context = slip.partialDepositContext;
  if (!context) {
    return null;
  }

  const remaining = context.ceiling - context.cashOnHand;
  const afterDeposit = context.cashOnHand - slip.expectedAmount;

  return (
    <>
      <div className="mt-[18px]">
        <Gauge
          value={context.cashOnHand}
          max={context.ceiling}
          label="Cash en main · plafond de détention"
          hint={`À ${Money.from(remaining).format()} du plafond — un dépôt partiel libère de la capacité pour continuer.`}
        />
      </div>

      <div className="rounded-card mt-4 bg-primary-deep px-[26px] py-6 text-white">
        <div className="text-[13px] font-bold tracking-[.06em] text-primary-bright uppercase">
          Montant à déposer · demandé par l'agent
        </div>
        <div className="num mt-2 text-[42px] font-bold tracking-[-0.03em]">
          {Money.from(slip.expectedAmount).format()}
        </div>
        <div className="mt-3 flex gap-[10px]">
          <div className="flex-1 rounded-tile bg-white/10 px-[14px] py-[11px]">
            <div className="text-[11px] font-semibold text-primary-tint">
              Avant dépôt
            </div>
            <div className="num text-[17px] font-bold">
              {context.cashOnHand.toLocaleString('fr-FR')}
            </div>
          </div>
          <div className="flex-1 rounded-tile bg-white/10 px-[14px] py-[11px]">
            <div className="text-[11px] font-semibold text-primary-tint">
              Reste en main
            </div>
            <div className="num text-[17px] font-bold">
              {afterDeposit.toLocaleString('fr-FR')}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-[10px]">
        <StatusTile
          label="Collecté à cet instant"
          value={context.collectedSoFar.toLocaleString('fr-FR')}
          hint={`${context.visitedClients} clients`}
        />
        <StatusTile
          label="Reste à visiter"
          value={String(context.remainingClients)}
          hint="clients prévus"
        />
        <StatusTile label="Dépôt du jour" value="1er" hint="de la tournée" />
      </div>

      <div className="rounded-tile mt-3 bg-info-soft px-[15px] py-3 text-[12.5px] font-semibold text-info">
        Ce dépôt sera déduit du reversement du soir de {slip.agentName}. La
        quittance émise est partielle.
      </div>
    </>
  );
};
