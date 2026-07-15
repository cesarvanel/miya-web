/**
 * Umbrella du module Administration — chaque carte (Configuration, Zones &
 * agences, Agents & responsables, Supervision) est un sous-module complet
 * (domain/application/infrastructure + son propre index.ts) sous
 * `submodules/`. Ce fichier est la SEULE API publique consommée par le reste
 * de l'app : personne d'externe n'importe un sous-module directement.
 */
export * from './submodules/configuration';
export * from './submodules/zones-agencies';
export * from './submodules/agents-admin';
export * from './submodules/supervision';

export { AdminRouter } from './infrastructure/router/AdminRouter';
