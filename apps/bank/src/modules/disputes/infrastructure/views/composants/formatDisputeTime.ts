/** « 09h13 » — heure d'ouverture, format des maquettes. */
export const formatTime = (iso: string): string => {
  const date = new Date(iso);
  return `${String(date.getHours()).padStart(2, '0')}h${String(date.getMinutes()).padStart(2, '0')}`;
};

/** Ancienneté relative — « il y a 6 min » / « il y a 2h20 ». */
export const formatAge = (iso: string): string => {
  const minutes = Math.floor((Date.now() - new Date(iso).getTime()) / 60_000);
  if (minutes < 60) {
    return `il y a ${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return remainder === 0 ? `il y a ${hours}h` : `il y a ${hours}h${String(remainder).padStart(2, '0')}`;
};
