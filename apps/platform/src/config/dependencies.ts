/**
 * Dépendances injectées dans les use cases (thunks) via `extra`.
 * Même pattern que bank : PlatformDependencies = intersection des contrats
 * `application/ports/<Module>Dependencies` des modules ; la composition root
 * instancie les adapters concrets (Http en prod, Fake en dev/tests).
 */
export type PlatformDependencies = Record<string, never>; // = {} pour l'instant

export const makePlatformDependencies = (): PlatformDependencies => ({});
