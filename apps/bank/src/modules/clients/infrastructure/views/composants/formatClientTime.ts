const MONTHS = [
  'janv', 'févr', 'mars', 'avr', 'mai', 'juin', 'juil', 'août', 'sept', 'oct', 'nov', 'déc',
];

/** « 3 juil · 08h26 » — format des maquettes pour l'historique des mouvements. */
export const formatOperationTime = (iso: string): string => {
  const date = new Date(iso);
  const day = date.getDate();
  const month = MONTHS[date.getMonth()];
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  return `${day} ${month} · ${hh}h${mm}`;
};

/** « juillet 2026 » — libellé de groupe mensuel (clé « 2026-07 »). */
export const formatMonthLabel = (monthKey: string): string => {
  const [year, month] = monthKey.split('-').map(Number);
  const date = new Date(Date.UTC(year ?? 2026, (month ?? 1) - 1, 1));
  return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric', timeZone: 'UTC' });
};
