import { useMemo, useState } from 'react';
import { useBankDispatch, useBankSelector } from '@/config/stores/root-hook/RootHook';
import { openModal } from '@/shared/modals';
import { AgenciesSelectors } from '../../../domain/selectors/Selectors';

export const useZonesAgenciesPage = () => {
  const dispatch = useBankDispatch();
  const agencies = useBankSelector(AgenciesSelectors.selectAllAgencies);
  const zoneCount = useBankSelector(AgenciesSelectors.selectZoneCount);
  const allZones = useBankSelector(AgenciesSelectors.selectAllZones);

  const [selectedAgencyId, setSelectedAgencyId] = useState<string>(agencies[0]?.id ?? '');
  const [search, setSearch] = useState('');

  const activeAgencyId = selectedAgencyId || agencies[0]?.id || '';
  const selectedAgency = agencies.find((agency) => agency.id === activeAgencyId);

  const zoneCountByAgency = (agencyId: string): number =>
    allZones.filter((zone) => zone.agencyId === agencyId).length;

  const allZonesForAgency = useBankSelector((state) =>
    AgenciesSelectors.selectZonesByAgency(state, activeAgencyId),
  );

  const zones = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) {
      return allZonesForAgency;
    }
    return allZonesForAgency.filter(
      (zone) =>
        zone.name.toLowerCase().includes(term) ||
        (zone.assignedAgentName ?? '').toLowerCase().includes(term),
    );
  }, [allZonesForAgency, search]);

  const openCreateZone = (): void => {
    dispatch(openModal({ type: 'createZone', props: { agencyId: activeAgencyId } }));
  };

  const openAssignAgent = (zoneId: string): void => {
    dispatch(openModal({ type: 'assignZoneAgent', props: { zoneId } }));
  };

  return {
    agencies,
    agencyCount: agencies.length,
    zoneCount,
    selectedAgencyId: activeAgencyId,
    selectedAgency,
    zones,
    zoneCountByAgency,
    search,
    setSearch,
    selectAgency: setSelectedAgencyId,
    openCreateZone,
    openAssignAgent,
  };
};
