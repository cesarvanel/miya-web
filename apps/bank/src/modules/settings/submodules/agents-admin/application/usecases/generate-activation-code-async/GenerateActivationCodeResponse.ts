export interface GenerateActivationCodeResponse {
  /** Ex. « 4827 · 6193 » — jamais persisté en Redux, affiché uniquement dans la modale. */
  code: string;
  /** ISO — la modale affiche le compte à rebours dérivé de cette date. */
  expiresAt: string;
}
