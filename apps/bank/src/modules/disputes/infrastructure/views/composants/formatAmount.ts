/** Nombre groupe par milliers, sans unite (ex. "1 000") - colonnes montant/ecart. */
export const formatAmount = (amount: number): string =>
  Math.trunc(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

/** Ecart signe (ex. "+500", "-500"). */
export const formatSignedGap = (gap: number): string =>
  gap >= 0 ? `+${formatAmount(gap)}` : `-${formatAmount(Math.abs(gap))}`;
