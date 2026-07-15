import React from 'react';
import { Link } from 'react-router-dom';
import { Button, TextField } from '@miya/ui';
import { AuthSplitShell } from '../composants/AuthSplitShell';
import { AuthRoutes } from '../../router/AuthRoutes';
import { useForgotPasswordPage } from './useForgotPasswordPage';

const BackLink: React.FC = () => (
  <Link to={AuthRoutes.loginPath} className="mb-5 inline-flex items-center gap-1.5 text-[12.5px] font-bold text-primary hover:underline">
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M8.5 3L4 7l4.5 4" stroke="#0A6B4E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    Retour à la connexion
  </Link>
);

/** Mot de passe oublié — formulaire puis état « lien envoyé ». Maquette B3/B4. */
export const ForgotPasswordPage: React.FC = () => {
  const { identifier, setIdentifier, submitting, maskedIdentifier, devToken, canResend, formatCountdown, submit, resend } = useForgotPasswordPage();

  if (maskedIdentifier) {
    return (
      <AuthSplitShell>
        <BackLink />
        <div className="bg-primary-soft flex size-14 items-center justify-center rounded-2xl">
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
            <rect x="3" y="6" width="20" height="15" rx="2.5" stroke="#0A6B4E" strokeWidth="1.7" />
            <path d="M4 7.5l9 6.5 9-6.5" stroke="#0A6B4E" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="mt-4 text-[22px] font-extrabold text-ink">Vérifiez votre boîte mail</div>
        <div className="mt-1.5 text-[13px] leading-[1.5] font-medium text-ink-muted">
          Un lien de réinitialisation a été envoyé à <span className="font-bold text-ink">{maskedIdentifier}</span>. Il est valable{' '}
          <span className="font-bold text-ink">30 minutes</span>.
        </div>

        <div className="bg-primary-soft/40 mt-4 rounded-xl border border-primary/20 px-3.5 py-3 text-[12px] font-semibold text-primary">
          Pensez à vérifier vos spams
        </div>

        <div className="mt-5 flex items-center gap-2 text-[12.5px] font-medium text-ink-muted">
          Pas reçu ?
          <button
            type="button"
            onClick={resend}
            disabled={!canResend}
            className={['cursor-pointer font-bold', canResend ? 'text-primary hover:underline' : 'cursor-not-allowed text-ink-disabled'].join(' ')}
          >
            {canResend ? 'Renvoyer' : `Renvoyer dans ${formatCountdown()}`}
          </button>
        </div>

        {devToken && (
          <div className="mt-6 rounded-xl border border-dashed border-line px-3.5 py-3 text-[11.5px] font-semibold text-ink-faint">
            (démo — aucun email n&rsquo;est réellement envoyé)
            <div className="mt-1.5 flex flex-col gap-1">
              <Link to={AuthRoutes.buildResetPasswordPath(devToken)} className="font-bold text-primary hover:underline">
                Ouvrir le lien de réinitialisation
              </Link>
              <Link to={AuthRoutes.buildResetPasswordPath('expired-demo')} className="font-bold text-primary hover:underline">
                Voir un lien expiré
              </Link>
            </div>
          </div>
        )}
      </AuthSplitShell>
    );
  }

  return (
    <AuthSplitShell>
      <BackLink />
      <div className="bg-primary-soft flex size-[52px] items-center justify-center rounded-[15px]">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="2.5" y="5" width="19" height="14" rx="2.3" stroke="#0A6B4E" strokeWidth="1.7" />
          <path d="M3.5 6.3l8.5 6.2 8.5-6.2" stroke="#0A6B4E" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="mt-4 text-[22px] font-extrabold text-ink">Mot de passe oublié</div>
      <div className="mt-1.5 text-[13px] leading-[1.5] font-medium text-ink-muted">
        Saisissez votre email ou téléphone. Nous vous enverrons un lien de réinitialisation.
      </div>

      <form
        className="mt-5 flex flex-col gap-3.5"
        onSubmit={(event) => {
          event.preventDefault();
          void submit();
        }}
      >
        <TextField label="Email ou téléphone" value={identifier} onChange={setIdentifier} placeholder="prenom.nom@laconfiance.cm" required />
        <Button type="submit" variant="primary" disabled={identifier.trim() === ''} loading={submitting} className="mt-1.5 w-full">
          Envoyer le lien
        </Button>
      </form>
    </AuthSplitShell>
  );
};
