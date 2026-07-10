import { createModalSystem } from '@miya/kernel';

/**
 * Enum des modales de la console éditeur — vide pour l'instant, chaque
 * module y ajoutera ses types et déclarera ses props dans PlatformModalProps.
 */
export type PlatformModal = never;

export type PlatformModalProps = Record<PlatformModal, undefined>;

export const { modalsSlice, openModal, closeModal, useModal } =
  createModalSystem<PlatformModal, PlatformModalProps>();
