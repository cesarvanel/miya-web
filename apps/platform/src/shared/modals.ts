import { createModalSystem } from '@miya/kernel';

/**
 * Enum des modales de la console éditeur — chaque module y ajoute ses types
 * et déclare ses props dans PlatformModalProps.
 */
export type PlatformModal = 'confirmLogout';

export interface PlatformModalProps {
  confirmLogout: undefined;
}

export const { modalsSlice, openModal, closeModal, useModal } =
  createModalSystem<PlatformModal, PlatformModalProps>();
