import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { NavBadge, type NavBadgeTone } from '@miya/ui';

export interface SidebarBadge {
  count: number;
  tone: NavBadgeTone;
}

interface SidebarUser {
  name: string;
  /** Ex. « Responsable · Mokolo ». */
  caption: string;
  initials: string;
}

interface SidebarProps {
  /** Compteurs par route (branchés plus tard sur les selectors des modules). */
  badges?: Partial<Record<string, SidebarBadge>>;
  /** TODO(auth): utilisateur connecté — placeholder maquette par défaut. */
  user?: SidebarUser;
  /** Entrée « Administration » — visible uniquement pour le rôle bank_admin. */
  showAdministration?: boolean;
  onLogout?: () => void;
}

interface NavItemConfig {
  to: string;
  label: string;
  icon: React.ReactElement;
}

interface NavSectionConfig {
  heading: string;
  items: NavItemConfig[];
}

const stroke = { stroke: 'currentColor', strokeWidth: 1.6 } as const;

/* Icônes reprises des maquettes (viewBox 20, stroke 1.6). */
const icons = {
  dashboard: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M3 9L10 3.5 17 9v7.5a.8.8 0 0 1-.8.8H12v-5H8v5H3.8a.8.8 0 0 1-.8-.8V9z" fill="currentColor" />
    </svg>
  ),
  settlements: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect x="2.5" y="5" width="15" height="10" rx="2" {...stroke} />
      <circle cx="10" cy="10" r="2.4" {...stroke} />
    </svg>
  ),
  disputes: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M10 3l8 14H2L10 3z" {...stroke} strokeLinejoin="round" />
      <path d="M10 8v4M10 14.5h.01" {...stroke} strokeLinecap="round" />
    </svg>
  ),
  collections: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M10 17s6-4.5 6-9a6 6 0 1 0-12 0c0 4.5 6 9 6 9z" {...stroke} />
      <circle cx="10" cy="8" r="2.2" {...stroke} />
    </svg>
  ),
  clients: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="7.5" cy="7.5" r="2.6" {...stroke} />
      <path d="M3 16a4.5 4.5 0 0 1 9 0" {...stroke} strokeLinecap="round" />
      <path d="M13.5 6a2.4 2.4 0 0 1 0 4.6M14 16a4.4 4.4 0 0 0-2-3.7" {...stroke} strokeLinecap="round" />
    </svg>
  ),
  agents: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect x="3" y="4" width="14" height="12" rx="2" {...stroke} />
      <circle cx="7.5" cy="9" r="1.8" {...stroke} />
      <path d="M11 8h4M11 11h3" {...stroke} strokeLinecap="round" />
    </svg>
  ),
  withdrawals: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M10 3v9m0 0l-3-3m3 3l3-3" {...stroke} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 15h12" {...stroke} strokeLinecap="round" />
    </svg>
  ),
  settings: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="2.6" {...stroke} />
      <path
        d="M10 3.5v2M10 14.5v2M3.5 10h2M14.5 10h2M5.4 5.4l1.4 1.4M13.2 13.2l1.4 1.4M14.6 5.4l-1.4 1.4M6.8 13.2l-1.4 1.4"
        {...stroke}
        strokeLinecap="round"
      />
    </svg>
  ),
};

/* Sections des maquettes ; pilotage + suivi opérationnel quotidien (agents y reste). */
const baseSections: NavSectionConfig[] = [
  {
    heading: 'Pilotage',
    items: [
      { to: '/', label: 'Tableau de bord', icon: icons.dashboard },
      { to: '/settlements', label: 'Reversements', icon: icons.settlements },
      { to: '/disputes', label: 'Contestations', icon: icons.disputes },
      { to: '/collections', label: 'Tournées', icon: icons.collections },
    ],
  },
  {
    heading: 'Suivi',
    items: [
      { to: '/clients', label: 'Clients', icon: icons.clients },
      { to: '/agents', label: 'Agents', icon: icons.agents },
      { to: '/withdrawals', label: 'Retraits', icon: icons.withdrawals },
    ],
  },
];

/** Entrée unique repliant toute l'administration — visible pour bank_admin uniquement. */
const administrationSection: NavSectionConfig = {
  heading: 'Administration',
  items: [{ to: '/admin', label: 'Administration', icon: icons.settings }],
};

const defaultUser: SidebarUser = {
  name: 'A. Mbarga',
  caption: 'Responsable · Mokolo',
  initials: 'AM',
};

export const Sidebar: React.FC<SidebarProps> = ({
  badges = {},
  user = defaultUser,
  showAdministration = false,
  onLogout,
}) => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const sections = showAdministration ? [...baseSections, administrationSection] : baseSections;

  return (
    <aside className="flex w-64 flex-none flex-col bg-primary-deep px-4 pt-[22px] pb-[18px]">
      {/* Logo */}
      <div className="flex items-center gap-[11px] px-2 pb-5">
        <div className="rounded-tile flex size-10 items-center justify-center bg-primary">
          <span className="num text-xl font-bold text-white">M</span>
        </div>
        <div>
          <div className="text-base font-extrabold tracking-[-0.01em] text-white">
            Miya <span className="text-primary-bright">Banque</span>
          </div>
          <div className="text-[11px] font-semibold text-primary-muted">
            MEC La Confiance
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1">
        {sections.map((section) => (
          <React.Fragment key={section.heading}>
            <div className="px-3 pt-4 pb-[6px] text-[10.5px] font-bold tracking-[.08em] text-sidebar-heading uppercase first:pt-3">
              {section.heading}
            </div>
            {section.items.map((item) => {
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
                        ? 'bg-primary font-bold text-white'
                        : 'font-semibold text-sidebar-item hover:bg-white/5 [&_svg]:text-sidebar-icon',
                    ].join(' ')
                  }
                >
                  {({ isActive }) => (
                    <>
                      {item.icon}
                      <span>{item.label}</span>
                      {badge && (
                        <NavBadge
                          count={badge.count}
                          tone={badge.tone}
                          inverted={isActive}
                          className="ml-auto"
                        />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </React.Fragment>
        ))}
      </nav>

      {/* Bloc utilisateur + menu logout */}
      <div className="relative mt-3">
        {isMenuOpen && (
          <div className="rounded-tile absolute right-0 bottom-full left-0 mb-2 overflow-hidden bg-card shadow-toast">
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                onLogout?.();
              }}
              className="flex w-full cursor-pointer items-center gap-2 px-4 py-3 text-left text-[13px] font-bold text-danger hover:bg-danger-soft"
            >
              Se déconnecter
            </button>
          </div>
        )}
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={isMenuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          className="flex w-full cursor-pointer items-center gap-[11px] rounded-[14px] bg-white/7 p-[11px] text-left hover:bg-white/10"
        >
          <span className="flex size-[38px] flex-none items-center justify-center rounded-[11px] bg-primary-soft text-sm font-bold text-primary">
            {user.initials}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[13.5px] font-bold text-white">
              {user.name}
            </span>
            <span className="block text-[11.5px] font-semibold text-primary-muted">
              {user.caption}
            </span>
          </span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M6 4l4 4-4 4"
              stroke="#6FA98F"
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
