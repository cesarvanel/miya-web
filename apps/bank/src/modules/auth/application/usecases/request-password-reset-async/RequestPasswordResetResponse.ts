export interface RequestPasswordResetResponse {
  /** Ex. « a.•••@laconfiance.cm ». */
  maskedIdentifier: string;
  /** Aucun email n'est réellement envoyé dans cette démo — le lien est exposé pour le parcours de test. */
  __devToken: string;
}
