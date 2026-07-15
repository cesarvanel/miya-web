import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, InitialsAvatar, PasswordField } from '@miya/ui';
import { useBankDispatch, useBankSelector } from '@/config/stores/root-hook/RootHook';
import { AuthStatus } from '../../../domain/slices/AuthSlice';
import { selectAuthStatus, selectCurrentUser } from '../../../domain/selectors/Selectors';
import { LogoutAsync } from '../../../application/usecases/logout-async/LogoutAsync';
import { RefreshSessionAsync } from '../../../application/usecases/refresh-session-async/RefreshSessionAsync';
import { AuthRoutes } from '../../router/AuthRoutes';

/**
 * Par-dessus l'app (le contenu derrière est flouté par `BankLayout`) — ne
 * navigue jamais : reprend la session sans perdre la page courante.
 */
export const SessionExpiredModal: React.FC = () => {
  const dispatch = useBankDispatch();
  const navigate = useNavigate();
  const status = useBankSelector(selectAuthStatus);
  const user = useBankSelector(selectCurrentUser);
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (status !== AuthStatus.SessionExpired || !user) {
    return null;
  }

  const resume = async (): Promise<void> => {
    if (password === '') {
      return;
    }
    setSubmitting(true);
    setError(null);
    const result = await dispatch(RefreshSessionAsync({ password }));
    setSubmitting(false);
    if (RefreshSessionAsync.fulfilled.match(result)) {
      setPassword('');
    } else {
      setError(result.payload?.message ?? 'Mot de passe incorrect.');
    }
  };

  const logout = async (): Promise<void> => {
    await dispatch(LogoutAsync());
    navigate(AuthRoutes.loginPath, { replace: true });
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="animate-scrim-in absolute inset-0 bg-scrim" />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-6">
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Session expirée"
          className="animate-modal-in pointer-events-auto w-100 max-w-full rounded-card-lg bg-card p-7.5 shadow-modal"
        >
          <div className="flex size-12.5 items-center justify-center rounded-[15px] bg-amber-soft">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="9" stroke="#B5771A" strokeWidth="1.7" />
              <path d="M12 7v5l3.5 2" stroke="#B5771A" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="mt-3.5 text-[19px] font-extrabold text-ink">Votre session a expiré</div>
          <div className="mt-1.5 text-[13px] leading-normal font-medium text-ink-muted">
            Pour votre sécurité, reconnectez-vous. Vos données non enregistrées sont conservées.
          </div>

          <div className="mt-4 flex items-center gap-2.5 rounded-xl bg-cream-100 px-3 py-2.5">
            <InitialsAvatar name={user.fullName} size="sm" />
            <div className="min-w-0">
              <div className="truncate text-[13px] font-bold text-ink">{user.fullName}</div>
              <div className="truncate text-[11.5px] font-medium text-ink-faint">{user.email}</div>
            </div>
          </div>

          <form
            className="mt-4"
            onSubmit={(event) => {
              event.preventDefault();
              void resume();
            }}
          >
            <PasswordField label="Mot de passe" value={password} onChange={setPassword} error={error ?? undefined} autoFocus required />
            <Button type="submit" variant="primary" disabled={password === ''} loading={submitting} className="mt-3.5 w-full">
              Reprendre ma session
            </Button>
          </form>
          <button
            type="button"
            onClick={() => void logout()}
            className="mt-3 w-full cursor-pointer text-center text-[12.5px] font-bold text-ink-faint hover:text-danger"
          >
            Se déconnecter
          </button>
        </div>
      </div>
    </div>
  );
};
