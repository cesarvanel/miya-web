/** « 09h13 » — heure, format des maquettes. */
export const formatTime = (iso: string): string => {
  const date = new Date(iso);
  return `${String(date.getHours()).padStart(2, '0')}h${String(date.getMinutes()).padStart(2, '0')}`;
};

/** « 3 juil. » — date courte, format des maquettes. */
export const formatShortDate = (iso: string): string =>
  new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });

/** Ancienneté relative — « il y a 6 min » / « il y a 2h20 » / « il y a 3 j ». */
export const formatAge = (iso: string): string => {
  const minutes = Math.floor((Date.now() - new Date(iso).getTime()) / 60_000);
  if (minutes < 60) {
    return `il y a ${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    const remainder = minutes % 60;
    return remainder === 0 ? `il y a ${hours}h` : `il y a ${hours}h${String(remainder).padStart(2, '0')}`;
  }
  const days = Math.floor(hours / 24);
  return `il y a ${days} j`;
};
