import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useOutsideClick } from '@miya/ui';

export interface SidebarBadge {
  count: number;
  tone: 'neutral' | 'danger';
}

interface SidebarUser {
  name: string;
  /** Ex. « Super admin ». */
  caption: string;
  initials: string;
}

interface SidebarProps {
  /** Compteurs par route (branchés plus tard sur les selectors des modules). */
  badges?: Partial<Record<string, SidebarBadge>>;
  /** Utilisateur connecté — fourni par SidebarContainer. */
  user?: SidebarUser;
  onLogout?: () => void;
}

interface NavItemConfig {
  to: string;
  label: string;
  icon: React.ReactElement;
}

const stroke = { stroke: 'currentColor', strokeWidth: 1.6 } as const;

/* Icônes reprises de la maquette admin (viewBox 20, stroke 1.6). */
const icons = {
  overview: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M3 9L10 3.5 17 9v7.5a.8.8 0 0 1-.8.8H12v-5H8v5H3.8a.8.8 0 0 1-.8-.8V9z" fill="currentColor" />
    </svg>
  ),
  tenants: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M3 8l7-4 7 4M4 8v8h12V8" {...stroke} strokeLinejoin="round" />
      <path d="M8 16v-4h4v4" {...stroke} strokeLinejoin="round" />
    </svg>
  ),
  billing: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect x="2.5" y="5" width="15" height="10" rx="2" {...stroke} />
      <path d="M2.5 8.5h15" {...stroke} />
    </svg>
  ),
  activity: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M2.5 10.5h3l2-5 3 9 2-6 1.5 2h3.5"
        {...stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  settings: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="2.6" {...stroke} />
      <path
        d="M10 3v2.5M10 14.5V17M3 10h2.5M14.5 10H17M5 5l1.8 1.8M13.2 13.2L15 15M15 5l-1.8 1.8M6.8 13.2L5 15"
        {...stroke}
        strokeLinecap="round"
      />
    </svg>
  ),
};

/* Section unique « Pilotage » de la maquette admin. */
const items: NavItemConfig[] = [
  { to: '/', label: "Vue d'ensemble", icon: icons.overview },
  { to: '/tenants', label: 'Banques', icon: icons.tenants },
  { to: '/billing', label: 'Abonnements', icon: icons.billing },
  { to: '/activity', label: 'Activité plateforme', icon: icons.activity },
  { to: '/settings', label: 'Paramètres', icon: icons.settings },
];

const badgeToneClasses: Record<SidebarBadge['tone'], string> = {
  neutral: 'bg-white/10 text-admin-badge-ink',
  danger: 'bg-danger text-white',
};

const defaultUser: SidebarUser = {
  name: 'S. Etoa',
  caption: 'Super admin',
  initials: 'SE',
};

export const Sidebar: React.FC<SidebarProps> = ({
  badges = {},
  user = defaultUser,
  onLogout,
}) => {
  const navigate = useNavigate();
  const [isMenuOpen, setMenuOpen] = useState(false);
  const menuRef = useOutsideClick<HTMLDivElement>(() => setMenuOpen(false), isMenuOpen);

  return (
    <aside className="flex w-64 flex-none flex-col bg-admin-sidebar px-4 pt-[22px] pb-[18px]">
      {/* Logo */}
      <div className="flex items-center gap-[11px] px-2 pb-[6px]">
        <div className="rounded-tile flex size-10 items-center justify-center bg-admin-primary">
          <span className="num text-xl font-bold text-white">M</span>
        </div>
        <div>
          <div className="text-base font-extrabold tracking-[-0.01em] text-white">
            Miya <span className="text-admin-accent">Admin</span>
          </div>
          <div className="text-[11px] font-semibold text-admin-muted">
            Console éditeur
          </div>
        </div>
      </div>

      {/* Chip Plateforme */}
      <div className="mx-2 mt-3 mb-2 inline-flex w-fit items-center gap-[7px] rounded-full border border-admin-accent/30 bg-admin-primary/15 px-[11px] py-[6px]">
        <span className="size-[7px] rounded-full bg-admin-accent" />
        <span className="text-[11.5px] font-bold tracking-[.02em] text-admin-chip-text">
          Plateforme
        </span>
      </div>

      {/* Navigation */}
      <nav className="mt-[6px] flex flex-1 flex-col gap-1">
        <div className="px-3 pt-3 pb-[6px] text-[10.5px] font-bold tracking-[.08em] text-admin-heading uppercase">
          Pilotage
        </div>
        {items.map((item) => {
          const badge = badges[item.to];
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                [
                  'rounded-tile flex items-center gap-3 px-[13px] py-[11px] text-sm',
                  isActive
                    ? 'bg-admin-primary font-bold text-white'
                    : 'font-semibold text-admin-item hover:bg-white/5 [&_svg]:text-admin-icon',
                ].join(' ')
              }
            >
              {item.icon}
              <span>{item.label}</span>
              {badge && badge.count > 0 && (
                <span
                  className={[
                    'num ml-auto rounded-full px-2 py-[2px] text-[11px] font-bold',
                    badgeToneClasses[badge.tone],
                  ].join(' ')}
                >
                  {badge.count}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bloc utilisateur + menu compte */}
      <div ref={menuRef} className="relative mt-3">
        {isMenuOpen && (
          <div className="rounded-tile absolute right-0 bottom-full left-0 mb-2 origin-bottom animate-acct-pop overflow-hidden bg-card shadow-toast">
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                navigate('/profile');
              }}
              className="flex w-full cursor-pointer items-center gap-2.5 px-4 py-3 text-left text-[13px] font-semibold text-ink hover:bg-cream-50"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <circle cx="8" cy="5.5" r="2.5" stroke="currentColor" strokeWidth="1.4" />
                <path d="M3 13a5 5 0 0 1 10 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
              Mon profil
            </button>
            <div className="mx-2 my-1 h-px bg-line" />
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                onLogout?.();
              }}
              className="flex w-full cursor-pointer items-center gap-2.5 px-4 py-3 text-left text-[13px] font-bold text-danger hover:bg-danger-soft"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M6 2.5H3.5a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1H6M10.5 11l3-3-3-3M13.2 8H6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Se déconnecter
            </button>
          </div>
        )}
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={isMenuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          className="flex w-full cursor-pointer items-center gap-[11px] rounded-[14px] bg-white/6 p-[11px] text-left hover:bg-white/10"
        >
          <span className="flex size-[38px] flex-none items-center justify-center rounded-[11px] bg-admin-primary text-sm font-bold text-white">
            {user.initials}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[13.5px] font-bold text-white">
              {user.name}
            </span>
            <span className="block text-[11.5px] font-semibold text-admin-muted">
              {user.caption}
            </span>
          </span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M6 4l4 4-4 4"
              stroke="#6E9285"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </aside>
  );
};
