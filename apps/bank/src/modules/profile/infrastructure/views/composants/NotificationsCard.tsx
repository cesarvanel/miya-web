import React from 'react';
import { Card, Toggle } from '@miya/ui';
import { BankUserRole } from '@/modules/auth';
import type { NotificationPreferences } from '../../../domain/entities/Profile';

interface NotificationsCardProps {
  role: BankUserRole;
  notifications: NotificationPreferences;
  onToggle: (key: keyof NotificationPreferences) => void;
}

const COPY: Record<BankUserRole, { subtitle: string; items: Record<keyof NotificationPreferences, { label: string; description: string }> }> = {
  [BankUserRole.Supervisor]: {
    subtitle: 'Ce dont je veux être prévenu·e en priorité',
    items: {
      disputeOpened: { label: 'Contestation entrante', description: 'Nouveau litige à arbitrer' },
      settlementPending: { label: 'Reversement en attente', description: 'Bordereau à valider' },
      capApproaching: { label: 'Plafond dépassé', description: "Cash en main d'un agent au-delà du seuil" },
    },
  },
  [BankUserRole.BankAdmin]: {
    subtitle: 'Alertes de niveau réseau, toutes agences',
    items: {
      disputeOpened: { label: 'Contestation entrante', description: 'Litige remonté par une agence' },
      settlementPending: { label: 'Reversement en attente', description: 'Non validé au-delà de 3 h' },
      capApproaching: { label: 'Plafond dépassé', description: "Un agent au-delà du seuil réseau" },
    },
  },
};

/** Toggles par type d'alerte — libellés adaptés au rôle. Maquette A1/A2. */
export const NotificationsCard: React.FC<NotificationsCardProps> = ({ role, notifications, onToggle }) => {
  const copy = COPY[role];
  return (
    <Card>
      <div className="text-[15px] font-extrabold text-ink">Notifications</div>
      <div className="mt-0.5 text-[12.5px] font-medium text-ink-muted">{copy.subtitle}</div>

      <div className="mt-3.5 flex flex-col gap-2.5">
        {(Object.keys(copy.items) as (keyof NotificationPreferences)[]).map((key) => (
          <div key={key} className="flex items-center justify-between rounded-xl border border-line px-3.5 py-3">
            <div className="min-w-0">
              <div className="text-[13px] font-bold text-ink">{copy.items[key].label}</div>
              <div className="text-[11.5px] font-medium text-ink-faint">{copy.items[key].description}</div>
            </div>
            <Toggle checked={notifications[key]} onChange={() => onToggle(key)} aria-label={copy.items[key].label} />
          </div>
        ))}
      </div>
    </Card>
  );
};
