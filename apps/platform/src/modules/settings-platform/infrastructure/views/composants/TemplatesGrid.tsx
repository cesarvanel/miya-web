import React from 'react';
import { Tooltip } from '@miya/ui';
import { AVAILABLE_TEMPLATE_VARIABLES, NotificationTemplateKind, type NotificationTemplate } from '../../../domain/entities/NotificationTemplate';

interface TemplatesGridProps {
  templates: NotificationTemplate[];
  canEdit: boolean;
  onEdit: (templateId: string) => void;
}

const KIND_LABEL: Record<NotificationTemplateKind, string> = {
  [NotificationTemplateKind.Welcome]: 'Bienvenue',
  [NotificationTemplateKind.PaymentReminder]: 'Retard de paiement',
  [NotificationTemplateKind.SuspensionNotice]: 'Suspension',
  [NotificationTemplateKind.PlanChanged]: 'Changement de plan',
};

const KIND_ICON_CLASSES: Record<NotificationTemplateKind, string> = {
  [NotificationTemplateKind.Welcome]: 'bg-primary-soft text-primary',
  [NotificationTemplateKind.PaymentReminder]: 'bg-danger-soft text-danger',
  [NotificationTemplateKind.SuspensionNotice]: 'bg-danger-soft text-danger',
  [NotificationTemplateKind.PlanChanged]: 'bg-violet-soft text-violet',
};

const KindIcon: React.FC<{ kind: NotificationTemplateKind }> = ({ kind }) => {
  if (kind === NotificationTemplateKind.Welcome) {
    return (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
        <path d="M2 4l5.5 4L13 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="2" y="3.5" width="11" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    );
  }
  if (kind === NotificationTemplateKind.PlanChanged) {
    return (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
        <path d="M9.5 2.5l3 3-7 7-3.5.5.5-3.5 7-7z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
      <path d="M7.5 2l6 10.5H1.5L7.5 2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M7.5 6v3M7.5 10.5h.01" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
};

/** Modèles de notifications — cartes par type, aperçu du sujet + body, clic → édition. Maquette 5a. */
export const TemplatesGrid: React.FC<TemplatesGridProps> = ({ templates, canEdit, onEdit }) => (
  <div className="grid grid-cols-2 gap-3.5">
    {templates.map((template) => (
      <div key={template.id} className="rounded-2xl border border-line p-4.5">
        <div className="mb-2.5 flex items-center gap-2.25">
          <span className={['flex size-8 items-center justify-center rounded-[9px]', KIND_ICON_CLASSES[template.kind]].join(' ')}>
            <KindIcon kind={template.kind} />
          </span>
          <span className="text-[13.5px] font-bold text-ink">{KIND_LABEL[template.kind]}</span>
        </div>
        <div className="text-xs font-semibold text-ink">Objet : {template.subject}</div>
        <div className="mt-1.5 line-clamp-2 text-[11.5px] leading-[1.5] font-medium text-ink-faint">« {template.body} »</div>
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {AVAILABLE_TEMPLATE_VARIABLES[template.kind].map((variable) => (
            <span key={variable} className="num rounded-full bg-cream-100 px-2.25 py-1 text-[10.5px] font-bold text-ink-muted">
              {variable}
            </span>
          ))}
          {canEdit ? (
            <button type="button" onClick={() => onEdit(template.id)} className="ml-auto cursor-pointer text-xs font-bold text-primary hover:underline">
              Modifier
            </button>
          ) : (
            <Tooltip label="Rôle lecture seule" className="ml-auto">
              <span className="cursor-not-allowed text-xs font-bold text-ink-disabled">Modifier</span>
            </Tooltip>
          )}
        </div>
      </div>
    ))}
  </div>
);
