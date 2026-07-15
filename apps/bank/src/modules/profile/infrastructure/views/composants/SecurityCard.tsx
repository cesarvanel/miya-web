import React from 'react';
import { Card } from '@miya/ui';
import type { ActiveSession } from '../../../domain/entities/Profile';

interface SecurityCardProps {
  activeSessions: ActiveSession[];
  onChangePassword: () => void;
  onRevokeSession: (sessionId: string) => void;
}

const DeviceIcon: React.FC<{ isCurrent: boolean }> = ({ isCurrent }) => (
  <div className={['flex size-9 flex-none items-center justify-center rounded-xl', isCurrent ? 'bg-primary-soft' : 'bg-cream-100'].join(' ')}>
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden="true">
      <rect x="2.5" y="2.5" width="12" height="9" rx="1.4" stroke={isCurrent ? '#0A6B4E' : '#6B7069'} strokeWidth="1.4" />
      <path d="M6 14h5" stroke={isCurrent ? '#0A6B4E' : '#6B7069'} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  </div>
);

/** Mot de passe + sessions actives — révocation à distance sauf la session courante. Maquette A1/A2. */
export const SecurityCard: React.FC<SecurityCardProps> = ({ activeSessions, onChangePassword, onRevokeSession }) => (
  <Card>
    <div className="text-[15px] font-extrabold text-ink">Sécurité</div>

    <div className="mt-3.5 flex items-center gap-3 rounded-xl border border-line px-3.5 py-3">
      <div className="bg-cream-100 flex size-9 flex-none items-center justify-center rounded-xl">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <rect x="3.5" y="7" width="9" height="6.5" rx="1.4" stroke="#6B7069" strokeWidth="1.4" />
          <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" stroke="#6B7069" strokeWidth="1.4" />
        </svg>
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[13.5px] font-bold text-ink">Mot de passe</div>
        <div className="text-[11.5px] font-medium text-ink-faint">Modifié récemment</div>
      </div>
      <button
        type="button"
        onClick={onChangePassword}
        className="bg-cream-100 flex-none cursor-pointer rounded-full px-3 py-1.5 text-xs font-bold text-ink hover:opacity-90"
      >
        Changer
      </button>
    </div>

    <div className="mt-4 mb-2 text-xs font-bold text-ink-muted uppercase tracking-[.04em]">Sessions actives</div>
    <div className="flex flex-col gap-2">
      {activeSessions.map((session) => (
        <div
          key={session.id}
          className={[
            'flex items-center gap-3 rounded-xl border px-3.5 py-3',
            session.isCurrent ? 'border-primary/25 bg-primary-soft/30' : 'border-line',
          ].join(' ')}
        >
          <DeviceIcon isCurrent={session.isCurrent} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="truncate text-[13px] font-bold text-ink">{session.device} · {session.browser}</span>
              {session.isCurrent && (
                <span className="bg-primary-soft flex-none rounded-full px-2 py-0.5 text-[10.5px] font-bold text-primary">Cet appareil</span>
              )}
            </div>
            <div className="text-[11.5px] font-medium text-ink-faint">{session.lastActiveAt}</div>
          </div>
          {!session.isCurrent && (
            <button
              type="button"
              onClick={() => onRevokeSession(session.id)}
              className="bg-danger-soft flex-none cursor-pointer rounded-full px-3 py-1.5 text-xs font-bold text-danger hover:opacity-90"
            >
              Déconnecter
            </button>
          )}
        </div>
      ))}
    </div>
  </Card>
);
