import { useMemo, useState } from 'react';
import { useRequestStatus } from '@miya/kernel';
import { useBankSelector } from '@/config/stores/root-hook/RootHook';
import { selectChangeLogBySection } from '../../../domain/selectors/Selectors';
import { FetchChangeLogAsync } from '../../../application/usecases/fetch-change-log-async/FetchChangeLogAsync';

export const CHANGE_LOG_SECTIONS = ['Règles de collecte', 'Plans', 'Identité', 'Validation', 'Frais de garde'];

const dayLabel = (iso: string): string => {
  const date = new Date(iso);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const sameDay = (a: Date, b: Date): boolean => a.toDateString() === b.toDateString();
  if (sameDay(date, today)) {
    return "Aujourd'hui";
  }
  if (sameDay(date, yesterday)) {
    return 'Hier';
  }
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
};

export const useChangeLog = () => {
  const [section, setSection] = useState<string | undefined>(undefined);
  const { isPending } = useRequestStatus(FetchChangeLogAsync);
  const entries = useBankSelector((state) => selectChangeLogBySection(state, section));

  const groups = useMemo(() => {
    const map = new Map<string, typeof entries>();
    for (const entry of entries) {
      const label = dayLabel(entry.at);
      map.set(label, [...(map.get(label) ?? []), entry]);
    }
    return Array.from(map.entries());
  }, [entries]);

  return { section, setSection, isPending, groups, isEmpty: entries.length === 0 };
};
