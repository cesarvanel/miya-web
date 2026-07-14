import React from 'react';
import { Card } from '@miya/ui';
import type { InstitutionIdentity } from '../../../domain/entities/BankSettings';

interface IdentityCardProps {
  identity: InstitutionIdentity;
  onEdit: () => void;
}

/** Identité de l'institution — lecture seule, « Modifier » ouvre la modale d'édition. Maquette 9a. */
export const IdentityCard: React.FC<IdentityCardProps> = ({ identity, onEdit }) => (
  <Card>
    <div id="settings-section-identity" className="mb-4 flex items-center justify-between">
      <div>
        <div className="text-[16px] font-extrabold text-ink">Identité de l&rsquo;institution</div>
        <div className="text-[12.5px] font-medium text-ink-faint">Coordonnées &amp; devise</div>
      </div>
      <button type="button" onClick={onEdit} className="cursor-pointer text-xs font-bold text-primary hover:underline">
        Modifier
      </button>
    </div>
    <div className="grid grid-cols-3 gap-3.5">
      <div>
        <div className="text-[11.5px] font-bold text-ink-faint">Raison sociale</div>
        <div className="mt-1 text-[14px] font-bold text-ink">{identity.name}</div>
      </div>
      <div>
        <div className="text-[11.5px] font-bold text-ink-faint">Siège</div>
        <div className="mt-1 text-[14px] font-bold text-ink">{identity.city}</div>
      </div>
      <div>
        <div className="text-[11.5px] font-bold text-ink-faint">Devise</div>
        <div className="num mt-1 text-[14px] font-bold text-ink">{identity.currency}</div>
      </div>
    </div>
  </Card>
);
