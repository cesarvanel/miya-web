import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { agenciesSelectors, FetchAgenciesAsync } from '@/modules/agencies';
import { settingsSelectors } from '@/modules/settings';
import { useBankDispatch, useBankSelector } from '@/config/stores/root-hook/RootHook';
import { AdminShell } from './AdminShell';

interface HubCardProps {
  to: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  meta?: string;
}

const HubCard: React.FC<HubCardProps> = ({ to, icon, title, description, meta }) => (
  <Link
    to={to}
    className="rounded-card-lg block border border-line bg-card p-6 transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[0_20px_40px_-24px_rgba(10,107,78,.35)]"
  >
    <div className="bg-primary-soft flex size-11 items-center justify-center rounded-xl">{icon}</div>
    <div className="mt-4 text-[16px] font-extrabold text-ink">{title}</div>
    <div className="mt-1 text-[13px] font-medium text-ink-muted">{description}</div>
    {meta && <div className="mt-3.5 text-[11.5px] font-semibold text-ink-faint">{meta}</div>}
  </Link>
);

const formatMeta = (at: string, by: string): string =>
  `dernière modif. ${new Date(at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })} par ${by}`;

/** Hub Administration — grille de cartes, extensible à mesure que de nouvelles sections d'admin apparaissent. */
export const AdminHubPage: React.FC = () => {
  const dispatch = useBankDispatch();
  const latestEntry = useBankSelector(settingsSelectors.selectLatestChangeLogEntry);
  const agencyCount = useBankSelector(agenciesSelectors.selectAgencyCount);
  const zoneCount = useBankSelector(agenciesSelectors.selectZoneCount);

  useEffect(() => {
    dispatch(FetchAgenciesAsync({}));
  }, [dispatch]);

  return (
    <AdminShell breadcrumb={[{ label: 'Administration' }]} title="Administration" subtitle="Configuration, zones & agences, audit">
      <div className="grid grid-cols-3 gap-5">
        <HubCard
          to="/admin/settings"
          title="Configuration"
          description="Identité, plans de cotisation, règles de collecte, frais & validation."
          meta={latestEntry ? formatMeta(latestEntry.at, latestEntry.by) : undefined}
          icon={
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
              <circle cx="11" cy="11" r="2.8" stroke="#0A6B4E" strokeWidth="1.6" />
              <path d="M11 3.5v2.4M11 15.1v2.4M18.5 11h-2.4M5.9 11H3.5M15.9 6.1l-1.7 1.7M7.8 14.2l-1.7 1.7M15.9 15.9l-1.7-1.7M7.8 7.8L6.1 6.1" stroke="#0A6B4E" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          }
        />
        <HubCard
          to="/admin/zones"
          title="Zones & agences"
          description="Découpage géographique et rattachement des agences."
          meta={agencyCount > 0 ? `${agencyCount} agences · ${zoneCount} zones de collecte` : undefined}
          icon={
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
              <path d="M11 19s7-5 7-11a7 7 0 1 0-14 0c0 6 7 11 7 11z" stroke="#0A6B4E" strokeWidth="1.6" />
              <circle cx="11" cy="8" r="2.6" stroke="#0A6B4E" strokeWidth="1.6" />
            </svg>
          }
        />
        <HubCard
          to="/admin/changelog"
          title="Journal des changements"
          description="Piste d'audit en lecture seule de toutes les modifications."
          icon={
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
              <circle cx="11" cy="11" r="8" stroke="#0A6B4E" strokeWidth="1.6" />
              <path d="M11 6.5V11l3.3 2" stroke="#0A6B4E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          }
        />
      </div>
    </AdminShell>
  );
};
