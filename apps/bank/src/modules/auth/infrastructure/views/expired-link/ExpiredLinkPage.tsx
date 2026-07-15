import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@miya/ui';
import { AuthSplitShell } from '../composants/AuthSplitShell';
import { AuthRoutes } from '../../router/AuthRoutes';

/** Lien de réinitialisation expiré ou invalide. Maquette B7. */
export const ExpiredLinkPage: React.FC = () => (
  <AuthSplitShell>
    <div className="flex size-14 items-center justify-center rounded-2xl bg-amber-soft">
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
        <circle cx="13" cy="13" r="9.5" stroke="#B5771A" strokeWidth="1.7" />
        <path d="M13 7.5V13l4 2.3" stroke="#B5771A" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
    <div className="mt-4 text-[22px] font-extrabold text-ink">Ce lien a expiré</div>
    <div className="mt-1.5 text-[13px] leading-[1.5] font-medium text-ink-muted">
      Les liens de réinitialisation sont valables 30 minutes. Demandez-en un nouveau pour continuer.
    </div>
    <Link to={AuthRoutes.forgotPasswordPath} className="mt-5 block">
      <Button variant="primary" className="w-full">
        Demander un nouveau lien
      </Button>
    </Link>
    <Link to={AuthRoutes.loginPath} className="mt-3.5 block text-center text-[12.5px] font-bold text-primary hover:underline">
      Retour à la connexion
    </Link>
  </AuthSplitShell>
);
