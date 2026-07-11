import React from 'react';

export type NotificationTone = 'success' | 'warning' | 'neutral';

export interface NotificationItem {
  id: string;
  title: string;
  meta: string;
  tone: NotificationTone;
  read: boolean;
}

interface NotificationPanelProps {
  items: NotificationItem[];
  onMarkAllRead?: () => void;
  onViewAll?: () => void;
}

const toneDotClasses: Record<NotificationTone, string> = {
  success: 'bg-primary',
  warning: 'bg-badge-amber',
  neutral: 'bg-transparent',
};

/** Panneau déroulant de notifications — item non lu teinté, pied "voir toutes". */
export const NotificationPanel: React.FC<NotificationPanelProps> = ({
  items,
  onMarkAllRead,
  onViewAll,
}) => {
  return (
    <div className="rounded-tile w-[340px] overflow-hidden border border-line bg-card shadow-[0_24px_50px_-22px_rgba(0,0,0,.35)]">
      <div className="flex items-center justify-between border-b border-line-soft px-4 py-[14px]">
        <span className="text-sm font-extrabold text-ink">Notifications</span>
        {onMarkAllRead && (
          <button
            type="button"
            onClick={onMarkAllRead}
            className="cursor-pointer text-xs font-bold text-primary"
          >
            Tout marquer lu
          </button>
        )}
      </div>
      <div className="max-h-96 overflow-y-auto">
        {items.map((item) => (
          <div
            key={item.id}
            className={[
              'flex gap-[11px] border-b border-line-soft px-4 py-[13px]',
              item.read ? '' : 'bg-[#F3FAF6]',
            ].join(' ')}
          >
            <span
              className={[
                'mt-[5px] size-2 flex-none rounded-full',
                item.read ? 'bg-transparent' : toneDotClasses[item.tone],
              ].join(' ')}
            />
            <div className="flex-1">
              <div
                className={item.read ? 'text-[13px] font-semibold text-ink-muted' : 'text-[13px] font-bold text-ink'}
              >
                {item.title}
              </div>
              <div
                className={
                  item.read ? 'text-[11.5px] font-medium text-ink-soft' : 'text-[11.5px] font-medium text-ink-muted'
                }
              >
                {item.meta}
              </div>
            </div>
          </div>
        ))}
      </div>
      {onViewAll && (
        <button
          type="button"
          onClick={onViewAll}
          className="w-full cursor-pointer p-3 text-center text-[12.5px] font-bold text-primary hover:bg-cream-50"
        >
          Voir toutes les notifications
        </button>
      )}
    </div>
  );
};
