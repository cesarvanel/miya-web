import React from 'react';
import type { Tenant } from '../../../domain/entities/Tenant';

interface IdentityContactsCardProps {
  tenant: Tenant;
}

interface FieldProps {
  label: string;
  children: React.ReactNode;
}

const Field: React.FC<FieldProps> = ({ label, children }) => (
  <div>
    <div className="text-[11.5px] font-semibold text-ink-faint">{label}</div>
    <div className="mt-0.5 text-[13.5px] font-bold text-ink">{children}</div>
  </div>
);

/** Identité & contacts — maquette 2f, colonne droite. */
export const IdentityContactsCard: React.FC<IdentityContactsCardProps> = ({ tenant }) => (
  <div className="rounded-card-lg border border-line bg-card p-5.5">
    <div className="mb-4 text-[15px] font-extrabold text-ink">Identité &amp; contacts</div>
    <div className="flex flex-col gap-3.5">
      <Field label="Raison sociale">{tenant.legalName ?? tenant.name}</Field>
      {tenant.cobacApproval && (
        <Field label="Agrément COBAC">
          <span className="num">{tenant.cobacApproval}</span>
        </Field>
      )}
      <Field label="Contact admin">
        <div>{tenant.adminContact.name}</div>
        <div className="mt-0.5 text-[12.5px] font-medium text-ink-muted">{tenant.adminContact.email}</div>
      </Field>
      {tenant.adminContact.phone && <Field label="Téléphone">{tenant.adminContact.phone}</Field>}
    </div>
  </div>
);
