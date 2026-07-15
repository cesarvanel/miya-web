import React from 'react';
import { Link } from 'react-router-dom';
import { Button, PasswordField } from '@miya/ui';
import { AuthSplitShell } from '../composants/AuthSplitShell';
import { PasswordStrengthGauge } from '../composants/PasswordStrengthGauge';
import { ExpiredLinkPage } from '../expired-link/ExpiredLinkPage';
import { AuthRoutes } from '../../router/AuthRoutes';
import { useResetPasswordPage } from './useResetPasswordPage';

/** Réinitialisation du mot de passe — jauge synchronisée avec la checklist, jamais « Robuste » avant. Maquette B5/B6. */
export const ResetPasswordPage: React.FC = () => {
  const {
    tokenStatus,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    strength,
    confirmMatches,
    canSubmit,
    submitting,
    succeeded,
    submit,
  } = useResetPasswordPage();

  if (tokenStatus === 'checking') {
    return (
      <AuthSplitShell>
        <div className="py-10 text-center text-sm font-medium text-ink-faint">Vérification du lien…</div>
      </AuthSplitShell>
    );
  }

  if (tokenStatus === 'invalid') {
    return <ExpiredLinkPage />;
  }

  if (succeeded) {
    return (
      <AuthSplitShell>
        <div className="flex flex-col items-center text-center">
          <div className="animate-seal-pop flex size-16 items-center justify-center rounded-[20px] bg-primary">
            <svg width="30" height="30" viewBox="0 0 30 30" fill="none" aria-hidden="true">
              <path d="M8 15.5l4.5 4.5L22 10" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="mt-4 text-[22px] font-extrabold text-ink">Mot de passe modifié</div>
          <div className="mt-1.5 text-[13px] leading-[1.5] font-medium text-ink-muted">
            Votre mot de passe a été mis à jour. Vous allez être redirigé·e vers la connexion.
          </div>
          <div className="mt-4 flex items-center gap-2 text-[12px] font-semibold text-ink-faint">
            <span className="size-3.5 animate-spin rounded-full border-2 border-line border-t-primary" />
            Redirection…
          </div>
          <Link to={AuthRoutes.loginPath} className="mt-5 block w-full">
            <Button variant="primary" className="w-full">
              Aller à la connexion
            </Button>
          </Link>
        </div>
      </AuthSplitShell>
    );
  }

  return (
    <AuthSplitShell>
      <div className="text-[22px] font-extrabold text-ink">Nouveau mot de passe</div>
      <div className="mt-1.5 text-[13px] font-medium text-ink-muted">Choisissez un mot de passe robuste pour sécuriser votre compte.</div>

      <form
        className="mt-5 flex flex-col gap-3.5"
        onSubmit={(event) => {
          event.preventDefault();
          void submit();
        }}
      >
        <div>
          <PasswordField label="Nouveau mot de passe" value={password} onChange={setPassword} placeholder="••••••••••" required />
          <div className="mt-2.5">
            <PasswordStrengthGauge strength={strength} />
          </div>
        </div>
        <PasswordField
          label="Confirmer le mot de passe"
          value={confirmPassword}
          onChange={setConfirmPassword}
          placeholder="••••••••••"
          required
          error={confirmPassword.length > 0 && !confirmMatches ? 'Les mots de passe ne correspondent pas.' : undefined}
        />
        <Button type="submit" variant="primary" disabled={!canSubmit} loading={submitting} className="mt-1.5 w-full">
          Réinitialiser le mot de passe
        </Button>
      </form>
    </AuthSplitShell>
  );
};
