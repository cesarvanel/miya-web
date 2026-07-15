export interface PasswordCriterion {
  id: 'length' | 'uppercase' | 'digit' | 'special';
  label: string;
  met: boolean;
}

export const PasswordStrengthLabel = { Empty: '', Weak: 'Faible', Fair: 'Moyen', Good: 'Bon', Strong: 'Robuste' } as const;
export type PasswordStrengthLabel = (typeof PasswordStrengthLabel)[keyof typeof PasswordStrengthLabel];

export interface PasswordStrength {
  criteria: PasswordCriterion[];
  /** Nombre de critères remplis, 0-4. */
  score: number;
  /** « Robuste » uniquement quand TOUS les critères sont remplis — jamais avant. */
  label: PasswordStrengthLabel;
  isValid: boolean;
}

const LABELS: PasswordStrengthLabel[] = [
  PasswordStrengthLabel.Empty,
  PasswordStrengthLabel.Weak,
  PasswordStrengthLabel.Fair,
  PasswordStrengthLabel.Good,
  PasswordStrengthLabel.Strong,
];

/** 4 critères, checklist temps réel synchronisée avec la jauge — « Robuste » seulement si score === 4. */
export const checkPasswordStrength = (password: string): PasswordStrength => {
  const criteria: PasswordCriterion[] = [
    { id: 'length', label: '8 caractères minimum', met: password.length >= 8 },
    { id: 'uppercase', label: 'Une majuscule', met: /[A-Z]/.test(password) },
    { id: 'digit', label: 'Un chiffre', met: /[0-9]/.test(password) },
    { id: 'special', label: 'Un caractère spécial', met: /[^A-Za-z0-9]/.test(password) },
  ];
  const score = criteria.filter((criterion) => criterion.met).length;
  const label = password.length === 0 ? PasswordStrengthLabel.Empty : LABELS[score];
  return { criteria, score, label, isValid: score === criteria.length };
};
