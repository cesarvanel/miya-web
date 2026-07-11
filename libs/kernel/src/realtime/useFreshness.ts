import { useEffect, useState } from 'react';

export interface UseFreshnessResult {
  status: 'updating' | 'fresh';
  label: string;
}

/**
 * Étiquette de fraîcheur ("il y a 8 s") ticking chaque seconde, dérivée d'un
 * `fetchedAt` (ex. celui de `cacheSlice`). Purement calcul/minuterie — le
 * rendu (spinner/icône) reste dans `FreshnessIndicator` de @miya/ui.
 */
export const useFreshness = (fetchedAt: number | null, isPending: boolean): UseFreshnessResult => {
  const [, forceTick] = useState(0);

  useEffect(() => {
    if (isPending || fetchedAt === null) {
      return undefined;
    }
    const interval = setInterval(() => forceTick((tick) => tick + 1), 1000);
    return () => clearInterval(interval);
  }, [isPending, fetchedAt]);

  if (isPending || fetchedAt === null) {
    return { status: 'updating', label: '' };
  }

  const seconds = Math.max(0, Math.round((Date.now() - fetchedAt) / 1000));
  const label = seconds < 60 ? `${seconds} s` : `${Math.round(seconds / 60)} min`;
  return { status: 'fresh', label };
};
