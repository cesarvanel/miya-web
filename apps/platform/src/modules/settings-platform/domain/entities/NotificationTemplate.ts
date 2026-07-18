import { createEntityAdapter } from '@reduxjs/toolkit';

export const NotificationTemplateKind = {
  Welcome: 'Welcome',
  PaymentReminder: 'PaymentReminder',
  SuspensionNotice: 'SuspensionNotice',
  PlanChanged: 'PlanChanged',
} as const;
export type NotificationTemplateKind = (typeof NotificationTemplateKind)[keyof typeof NotificationTemplateKind];

export interface NotificationTemplate {
  id: string;
  kind: NotificationTemplateKind;
  subject: string;
  /** Texte libre avec variables `{{bankName}}`, `{{amount}}`, `{{dueDate}}`… */
  body: string;
  lastEditedBy: string;
  /** ISO. */
  lastEditedAt: string;
}

export const templatesAdapter = createEntityAdapter<NotificationTemplate, string>({
  selectId: (template) => template.id,
});

/** Variables proposées comme chips dans l'éditeur — dépend du type de message. */
export const AVAILABLE_TEMPLATE_VARIABLES: Record<NotificationTemplateKind, string[]> = {
  [NotificationTemplateKind.Welcome]: ['{{bankName}}', '{{adminName}}'],
  [NotificationTemplateKind.PaymentReminder]: ['{{bankName}}', '{{amount}}', '{{dueDate}}', '{{suspensionDate}}'],
  [NotificationTemplateKind.SuspensionNotice]: ['{{bankName}}', '{{suspensionDate}}'],
  [NotificationTemplateKind.PlanChanged]: ['{{bankName}}', '{{planName}}'],
};

/** Variables qui DOIVENT rester présentes dans le body — un body sans {{bankName}} pour un PaymentReminder est rejeté. */
export const REQUIRED_TEMPLATE_VARIABLES: Record<NotificationTemplateKind, string[]> = {
  [NotificationTemplateKind.Welcome]: ['{{bankName}}'],
  [NotificationTemplateKind.PaymentReminder]: ['{{bankName}}', '{{amount}}', '{{dueDate}}'],
  [NotificationTemplateKind.SuspensionNotice]: ['{{bankName}}'],
  [NotificationTemplateKind.PlanChanged]: ['{{bankName}}'],
};

export interface TemplateValidationResult {
  valid: boolean;
  missing: string[];
}

/** Fonction pure — utilisée par le slice (garde-fou silencieux) ET par l'use case (erreur claire, avant la gateway). */
export const validateTemplateBody = (kind: NotificationTemplateKind, body: string): TemplateValidationResult => {
  const missing = REQUIRED_TEMPLATE_VARIABLES[kind].filter((variable) => !body.includes(variable));
  return { valid: missing.length === 0, missing };
};
