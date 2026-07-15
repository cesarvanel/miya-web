import React from 'react';
import { Button, Card, EmptyState, SearchInput } from '@miya/ui';
import { AdminShell } from '@/shared/layout/AdminShell';
import { AgencyCard } from '../composants/AgencyCard';
import { AgencyDetailPanel } from '../composants/AgencyDetailPanel';
import { ZoneRow } from '../composants/ZoneRow';
import { CreateZoneModal } from '../modal/CreateZoneModal';
import { AssignZoneAgentModal } from '../modal/AssignZoneAgentModal';
import { useZonesAgenciesPage } from './useZonesAgenciesPage';

const PlusIcon: React.FC = () => (
  <svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden="true">
    <path d="M8.5 3v11M3 8.5h11" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" />
  </svg>
);

/** Espace Administration > Zones & agences — maquette 8a. */
export const ZonesAgenciesPage: React.FC = () => {
  const {
    agencies,
    agencyCount,
    zoneCount,
    selectedAgencyId,
    selectedAgency,
    zones,
    zoneCountByAgency,
    search,
    setSearch,
    selectAgency,
    openCreateZone,
    openAssignAgent,
  } = useZonesAgenciesPage();

  return (
    <AdminShell
      breadcrumb={[{ label: 'Administration', to: '/admin' }, { label: 'Zones & agences' }]}
      title="Zones & agences"
      subtitle={`${agencyCount} agence${agencyCount > 1 ? 's' : ''} · ${zoneCount} zone${zoneCount > 1 ? 's' : ''} de collecte`}
      actions={
        <>
          <SearchInput value={search} onChange={setSearch} placeholder="Zone, agence…" aria-label="Rechercher une zone ou une agence" />
          <Button variant="primary" onClick={openCreateZone}>
            <span className="flex items-center gap-2">
              <PlusIcon />
              Nouvelle zone
            </span>
          </Button>
        </>
      }
    >
      <div className="flex items-start gap-5.5">
        <div className="w-80 flex-none flex flex-col gap-4">
          <Card padding="none">
            <div className="flex items-baseline justify-between px-5 pt-4 pb-3">
              <span className="text-[16px] font-extrabold text-ink">Agences</span>
              <span className="num rounded-full bg-cream-100 px-2.75 py-1 text-xs font-bold text-ink-muted">{agencyCount}</span>
            </div>
            <div className="flex flex-col gap-2 px-3 pb-3">
              {agencies.map((agency) => (
                <AgencyCard
                  key={agency.id}
                  agency={agency}
                  zoneCount={zoneCountByAgency(agency.id)}
                  active={agency.id === selectedAgencyId}
                  onSelect={selectAgency}
                />
              ))}
            </div>
          </Card>
          {selectedAgency && <AgencyDetailPanel agency={selectedAgency} />}
        </div>

        <Card padding="none" className="min-w-0 flex-1">
          <div className="flex items-center justify-between border-b border-line-soft px-5.5 py-4">
            <div>
              <span className="text-[16px] font-extrabold text-ink">
                Zones de collecte {selectedAgency ? `· ${selectedAgency.name}` : ''}
              </span>
              <div className="mt-0.5 text-[12.5px] font-medium text-ink-faint">Affectez un agent à chaque zone</div>
            </div>
            <span className="num rounded-full bg-cream-100 px-3 py-1.5 text-xs font-bold text-ink-muted">
              {zones.length} zone{zones.length > 1 ? 's' : ''}
            </span>
          </div>

          {zones.length === 0 ? (
            <EmptyState
              title="Aucune zone enregistrée"
              description="Créez la première zone de collecte de cette agence."
              action={<Button variant="primary" onClick={openCreateZone}>Nouvelle zone</Button>}
            />
          ) : (
            <>
              <div className="grid grid-cols-[2fr_1.6fr_1fr_1fr_24px] gap-3.5 border-b border-line-soft bg-cream-50 px-5.5 py-2.75 text-[10.5px] font-bold tracking-[.04em] text-ink-soft uppercase">
                <span>Zone</span>
                <span>Agent affecté</span>
                <span className="text-right">Clients</span>
                <span className="text-right">Régul.</span>
                <span />
              </div>
              {zones.map((zone) => (
                <ZoneRow key={zone.id} zone={zone} onAssignAgent={openAssignAgent} />
              ))}
            </>
          )}
        </Card>
      </div>

      <CreateZoneModal />
      <AssignZoneAgentModal />
    </AdminShell>
  );
};
