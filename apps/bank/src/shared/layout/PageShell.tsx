import React from 'react';
import { Header, type HeaderBack } from './Header';

interface PageShellProps {
  title: string;
  subtitle?: string;
  /** Lien de retour affiché à gauche du titre — pages de détail uniquement. */
  back?: HeaderBack;
  /** Zone droite du header (SearchInput, filtres…). */
  actions?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Colonne principale d'une page : Header fixe + contenu scrollable
 * (padding des maquettes : 26px 32px 40px). La Sidebar est posée par le
 * layout du router.
 */
export const PageShell: React.FC<PageShellProps> = ({
  title,
  subtitle,
  back,
  actions,
  children,
}) => {
  return (
    <div className="flex h-full min-w-0 flex-1 flex-col">
      <Header title={title} subtitle={subtitle} back={back} actions={actions} />
      <main className="flex-1 overflow-y-auto px-8 pt-[26px] pb-10">
        {children}
      </main>
    </div>
  );
};
