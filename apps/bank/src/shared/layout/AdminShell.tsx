import React from 'react';
import { Link } from 'react-router-dom';

export interface AdminBreadcrumbItem {
  label: string;
  to?: string;
}

export interface AdminSecondaryNavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
}

interface AdminShellProps {
  /** « Administration > Configuration > Règles de collecte ». */
  breadcrumb: AdminBreadcrumbItem[];
  title: string;
  subtitle?: string;
  /** Zone droite du header (ex. bouton « Journal des changements »). */
  actions?: React.ReactNode;
  /** Nav secondaire verticale sticky à gauche — omise sur le hub. */
  secondaryNav?: AdminSecondaryNavItem[];
  children: React.ReactNode;
}

/**
 * Layout de second niveau pour l'espace Administration — fil d'Ariane, nav
 * secondaire (pattern de la maquette Configuration : icône + état actif
 * émeraude), zone de contenu. La Sidebar principale reste posée par le
 * layout du router, avec son entrée « Administration » active.
 */
export const AdminShell: React.FC<AdminShellProps> = ({ breadcrumb, title, subtitle, actions, secondaryNav, children }) => {
  return (
    <div className="flex h-full min-w-0 flex-1 flex-col">
      <header className="flex h-[78px] flex-none items-center justify-between border-b border-header-line bg-cream/85 px-8 backdrop-blur">
        <div>
          <nav aria-label="Fil d'Ariane" className="flex items-center gap-[7px] text-[12.5px] font-semibold text-ink-faint">
            {breadcrumb.map((item, index) => (
              <React.Fragment key={item.label}>
                {index > 0 && <span aria-hidden="true">/</span>}
                {item.to ? (
                  <Link to={item.to} className="hover:text-ink-muted hover:underline">
                    {item.label}
                  </Link>
                ) : (
                  <span>{item.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
          <h1 className="mt-0.5 text-[22px] font-extrabold tracking-[-0.02em] text-ink">{title}</h1>
          {subtitle && <div className="mt-px text-[13px] font-medium text-ink-muted">{subtitle}</div>}
        </div>
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </header>

      <main className="flex flex-1 items-start gap-5.5 overflow-y-auto px-8 pt-[26px] pb-10">
        {secondaryNav && (
          <div className="w-60 flex-none sticky top-0 rounded-card-lg border border-line bg-card p-3">
            {secondaryNav.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={item.onClick}
                className={[
                  'flex w-full cursor-pointer items-center gap-2.75 rounded-xl px-3.25 py-2.75 text-left text-[13.5px] transition',
                  item.active ? 'bg-primary font-bold text-white' : 'font-semibold text-ink-muted hover:bg-cream-50',
                ].join(' ')}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        )}
        <div className="min-w-0 flex-1">{children}</div>
      </main>
    </div>
  );
};
