import React from 'react';
import { ClientStatus, type Client } from '../../../domain/entities/Client';

interface ClientStatusChipProps {
  client: Pick<Client, 'status' | 'pendingWithdrawal'>;
}

/** « Actif » / « Retrait ⏳ » / « Inactif » — priorité au retrait en cours. */
export const ClientStatusChip: React.FC<ClientStatusChipProps> = ({ client }) => {
  if (client.pendingWithdrawal) {
    return (
      <span className="animate-badge-in rounded-full bg-amber-soft px-[10px] py-1 text-[11px] font-bold whitespace-nowrap text-amber">
        Retrait <span role="img" aria-label="en attente" className="animate-pulse-soft inline-block">⏳</span>
      </span>
    );
  }
  if (client.status === ClientStatus.Inactive) {
    return (
      <span className="rounded-full bg-neutral-soft px-[10px] py-1 text-[11px] font-bold whitespace-nowrap text-neutral">
        Inactif
      </span>
    );
  }
  return (
    <span className="bg-primary-soft text-primary rounded-full px-[10px] py-1 text-[11px] font-bold whitespace-nowrap">
      Actif
    </span>
  );
};
