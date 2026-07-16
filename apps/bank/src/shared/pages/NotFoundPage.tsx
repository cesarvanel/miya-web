import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@miya/ui';

/** Route générique — aucun chemin ne correspond. Maquette C1. */
export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-6 text-center">
      <div className="num text-[96px] leading-none font-bold tracking-[-0.03em] text-primary">404</div>
      <div className="my-6.5 h-1.5 w-30 rounded-full bg-primary-soft" />
      <div className="text-[22px] font-extrabold tracking-[-0.01em] text-ink">Page introuvable</div>
      <div className="mt-2 max-w-[300px] text-sm leading-[1.55] font-medium text-ink-muted">
        La page que vous cherchez a été déplacée ou n&rsquo;existe plus.
      </div>
      <div className="mt-7 flex gap-2.5">
        <Button variant="primary" onClick={() => navigate('/')}>
          Retour au tableau de bord
        </Button>
        <Button variant="secondary" onClick={() => navigate(-1)}>
          Page précédente
        </Button>
      </div>
    </div>
  );
};
