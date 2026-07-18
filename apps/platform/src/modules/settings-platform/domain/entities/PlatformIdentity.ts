export interface PlatformIdentityContacts {
  email: string;
  phone: string;
}

/** Identité de l'éditeur — utilisée sur la console ET sur les factures d'abonnement envoyées aux banques. */
export interface PlatformIdentity {
  /** Nom court, ex. "Miya" — utilisé dans la console. */
  name: string;
  /** Raison sociale complète, ex. "Miya SAS" — figure sur les factures. */
  legalName: string;
  /** N° contribuable — figure sur les factures. */
  taxNumber: string;
  logoUrl?: string;
  contacts: PlatformIdentityContacts;
  /** Mentions légales en bas de facture (RCCM, siège, conditions de paiement, TVA…). */
  invoiceMentions: string;
}
