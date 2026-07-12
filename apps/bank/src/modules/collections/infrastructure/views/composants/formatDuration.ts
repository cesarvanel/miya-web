const toMinutes = (time: string): number => {
  const [hh = '0', mm = '0'] = time.replace('h', ':').split(':');
  return Number(hh) * 60 + Number(mm);
};

/** « 5h 05 » — durée entre deux horaires maquette (« 07h00 » → « 12h05 »). */
export const formatRoundDuration = (startedAt: string, endedAt: string): string => {
  const minutes = Math.max(0, toMinutes(endedAt) - toMinutes(startedAt));
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return `${hours}h ${String(remainder).padStart(2, '0')}`;
};
