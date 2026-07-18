import React from 'react';
import { Card } from '@miya/ui';
import type { PlatformIdentity } from '../../../domain/entities/PlatformIdentity';

interface PlatformIdentityCardProps {
  identity: PlatformIdentity;
  canEdit: boolean;
  onEdit: () => void;
}

/** Identité Miya — lecture seule, visible sur la console ET les factures d'abonnement. Maquette 5a. */
export const PlatformIdentityCard: React.FC<PlatformIdentityCardProps> = ({ identity, canEdit, onEdit }) => (
  <Card>
    <div id="platform-settings-section-identity" className="mb-5 flex items-center justify-between">
      <div>
        <div className="text-[16px] font-extrabold text-ink">Identité Miya</div>
        <div className="text-[12.5px] font-medium text-ink-faint">
          Utilisée sur la console et sur les factures d&rsquo;abonnement envoyées aux banques.
        </div>
      </div>
      {canEdit && (
        <button type="button" onClick={onEdit} className="cursor-pointer text-xs font-bold text-primary hover:underline">
          Modifier
        </button>
      )}
    </div>
    <div className="flex gap-6.5">
      <div className="flex-none text-center">
        <div className="relative flex size-24 items-center justify-center rounded-[22px] bg-admin-sidebar">
          <span className="num text-[44px] font-bold text-white">{identity.name.charAt(0)}</span>
          <span className="bg-admin-primary absolute -right-1.5 -bottom-1.5 size-6.5 rounded-[9px] border-[3px] border-card" />
        </div>
        <div className="mt-3 text-[10.5px] font-medium text-ink-faint">PNG · 512px</div>
      </div>
      <div className="grid flex-1 grid-cols-2 content-start gap-3.5">
        <div>
          <div className="text-[11.5px] font-bold text-ink-faint">Raison sociale</div>
          <div className="mt-1 text-[13.5px] font-bold text-ink">{identity.legalName}</div>
        </div>
        <div>
          <div className="text-[11.5px] font-bold text-ink-faint">N° contribuable</div>
          <div className="num mt-1 text-[13.5px] font-bold text-ink">{identity.taxNumber}</div>
        </div>
        <div>
          <div className="text-[11.5px] font-bold text-ink-faint">E-mail de facturation</div>
          <div className="mt-1 text-[13.5px] font-bold text-ink-muted">{identity.contacts.email}</div>
        </div>
        <div>
          <div className="text-[11.5px] font-bold text-ink-faint">Téléphone</div>
          <div className="num mt-1 text-[13.5px] font-bold text-ink">{identity.contacts.phone}</div>
        </div>
        <div className="col-span-2">
          <div className="text-[11.5px] font-bold text-ink-faint">Mentions bas de facture</div>
          <div className="mt-1.5 rounded-xl border border-line-soft bg-cream p-3.5 text-[12.5px] leading-[1.55] font-medium text-ink-muted">
            {identity.invoiceMentions}
          </div>
        </div>
      </div>
    </div>
  </Card>
);
