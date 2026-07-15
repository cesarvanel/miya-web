import { useState } from 'react';
import { useRequestStatus } from '@miya/kernel';
import { useBankDispatch, useBankSelector } from '@/config/stores/root-hook/RootHook';
import { openModal } from '@/shared/modals';
import { selectSettings } from '../../../domain/selectors/Selectors';
import { FetchSettingsAsync } from '../../../application/usecases/fetch-settings-async/FetchSettingsAsync';

export type SettingsSectionId = 'identity' | 'plans' | 'rules' | 'custody' | 'validation';

export const SETTINGS_SECTIONS: { id: SettingsSectionId; label: string }[] = [
  { id: 'identity', label: 'Identité' },
  { id: 'plans', label: 'Plans de cotisation' },
  { id: 'rules', label: 'Règles de collecte' },
  { id: 'custody', label: 'Frais de garde' },
  { id: 'validation', label: 'Chaîne de validation' },
];

export const useSettingsPage = () => {
  const dispatch = useBankDispatch();
  const settings = useBankSelector(selectSettings);
  const { isPending } = useRequestStatus(FetchSettingsAsync);
  const [activeSection, setActiveSection] = useState<SettingsSectionId>('identity');

  const goToSection = (id: SettingsSectionId): void => {
    setActiveSection(id);
    document.getElementById(`settings-section-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const openEditIdentity = (): void => {
    dispatch(openModal({ type: 'editIdentity', props: undefined }));
  };
  const openManagePlans = (): void => {
    dispatch(openModal({ type: 'managePlans', props: undefined }));
  };
  const openCustodyFees = (): void => {
    dispatch(openModal({ type: 'editCustodyFees', props: undefined }));
  };

  return {
    settings,
    isPending,
    activeSection,
    goToSection,
    openEditIdentity,
    openManagePlans,
    openCustodyFees,
  };
};
