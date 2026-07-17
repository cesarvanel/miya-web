import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@miya/ui';

/** Rôle non autorisé pour la route courante (RequireRole). */
export const ForbiddenPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-6 text-center">
      <div className="flex size-22 items-center justify-center rounded-[26px] bg-amber-soft">
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="5" y="10.5" width="14" height="9.5" rx="2.2" stroke="#B5771A" strokeWidth="1.8" />
          <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" stroke="#B5771A" strokeWidth="1.8" />
          <circle cx="12" cy="15" r="1.4" fill="#B5771A" />
        </svg>
      </div>
      <div className="num mt-3.5 text-[40px] leading-none font-bold tracking-[-0.02em] text-amber">403</div>
      <div className="mt-1 text-[22px] font-extrabold tracking-[-0.01em] text-ink">Accès refusé</div>
      <div className="mt-2 max-w-[310px] text-sm leading-[1.55] font-medium text-ink-muted">
        Cette section est réservée à un autre rôle. Contactez un autre super-administrateur si vous pensez qu&rsquo;il s&rsquo;agit d&rsquo;une erreur.
      </div>
      <div className="mt-7">
        <Button variant="primary" onClick={() => navigate('/')}>
          Retour à mon espace
        </Button>
      </div>
    </div>
  );
};
