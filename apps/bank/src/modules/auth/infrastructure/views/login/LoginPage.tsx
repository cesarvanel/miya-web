import React from 'react';
import { Link } from 'react-router-dom';
import { Button, PasswordField, TextField } from '@miya/ui';
import { AuthSplitShell } from '../composants/AuthSplitShell';
import { AuthRoutes } from '../../router/AuthRoutes';
import { useLoginPage } from './useLoginPage';

/** Écran de connexion — split-screen, erreur en bannière + shake. Maquette B1/B2. */
export const LoginPage: React.FC = () => {
  const { identifier, setIdentifier, password, setPassword, submitting, canSubmit, loginError, attemptId, submit } = useLoginPage();

  return (
    <AuthSplitShell>
      <div className="text-[22px] font-extrabold text-ink">Connexion à votre espace</div>
      <div className="mt-1 text-[13px] font-medium text-ink-muted">Accès réservé au personnel de l&rsquo;établissement</div>

      {loginError && (
        <div
          key={attemptId}
          className="animate-auth-shake mt-4 flex items-start gap-2.5 rounded-xl border border-[#E8B0AA] bg-danger-soft px-3.5 py-3"
        >
          <svg width="17" height="17" viewBox="0 0 18 18" fill="none" aria-hidden="true" className="mt-px flex-none">
            <circle cx="9" cy="9" r="6.5" stroke="#C43B32" strokeWidth="1.5" />
            <path d="M9 5.5v4M9 11.5h.01" stroke="#C43B32" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <div>
            <div className="text-[13px] font-extrabold text-danger-deep">Identifiants incorrects</div>
            <div className="mt-0.5 text-[12.5px] font-semibold text-[#B65950]">
              {loginError.message}
              {typeof loginError.remainingAttempts === 'number' && loginError.remainingAttempts > 0 && (
                <> {loginError.remainingAttempts} tentative{loginError.remainingAttempts > 1 ? 's' : ''} restante{loginError.remainingAttempts > 1 ? 's' : ''}.</>
              )}
            </div>
          </div>
        </div>
      )}

      <form
        className="mt-5 flex flex-col gap-3.5"
        onSubmit={(event) => {
          event.preventDefault();
          void submit();
        }}
      >
        <TextField
          label="Email ou téléphone"
          value={identifier}
          onChange={setIdentifier}
          placeholder="prenom.nom@laconfiance.cm"
          error={loginError ? ' ' : undefined}
          required
        />
        <PasswordField
          label="Mot de passe"
          value={password}
          onChange={setPassword}
          placeholder="••••••••"
          error={loginError ? ' ' : undefined}
          required
          labelRight={
            <Link to={AuthRoutes.forgotPasswordPath} className="text-[12px] font-bold text-primary hover:underline">
              Oublié ?
            </Link>
          }
        />
        <Button type="submit" variant="primary" disabled={!canSubmit} loading={submitting} className="mt-1.5 w-full">
          {submitting ? 'Connexion…' : loginError ? 'Réessayer' : 'Se connecter'}
        </Button>
      </form>
    </AuthSplitShell>
  );
};
