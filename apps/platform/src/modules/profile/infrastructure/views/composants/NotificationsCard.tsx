import React from 'react';
import { Card, Toggle } from '@miya/ui';
import type { PlatformNotificationPreferences } from '../../../domain/entities/Profile';

interface NotificationsCardProps {
  notifications: PlatformNotificationPreferences;
  onToggle: (key: keyof PlatformNotificationPreferences) => void;
}

const ITEMS: Record<keyof PlatformNotificationPreferences, { label: string; description: string }> = {
  paymentOverdue: { label: 'Retard de paiement', description: 'Une facture de banque passe en retard' },
  trialEndingSoon: { label: 'Essai qui se termine', description: "Une banque en essai arrive à échéance sous 7 jours" },
  syncAlerts: { label: 'Synchronisations en difficulté', description: "Le taux d'erreur de synchro d'une banque dépasse le seuil" },
};

/** Toggles des 3 alertes plateforme (overview/billing/activity) — pas les alertes bank. Maquette Profil. */
export const NotificationsCard: React.FC<NotificationsCardProps> = ({ notifications, onToggle }) => (
  <Card>
    <div className="text-[15px] font-extrabold text-ink">Notifications</div>
    <div className="mt-0.5 text-[12.5px] font-medium text-ink-muted">Ce dont je veux être prévenu·e sur la plateforme</div>

    <div className="mt-3.5 flex flex-col gap-2.5">
      {(Object.keys(ITEMS) as (keyof PlatformNotificationPreferences)[]).map((key) => (
        <div key={key} className="flex items-center justify-between rounded-xl border border-line px-3.5 py-3">
          <div className="min-w-0">
            <div className="text-[13px] font-bold text-ink">{ITEMS[key].label}</div>
            <div className="text-[11.5px] font-medium text-ink-faint">{ITEMS[key].description}</div>
          </div>
          <Toggle checked={notifications[key]} onChange={() => onToggle(key)} aria-label={ITEMS[key].label} />
        </div>
      ))}
    </div>
  </Card>
);
