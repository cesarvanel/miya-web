import React from 'react';
import { Button, Card, TextField } from '@miya/ui';
import { BankUserRole, type SessionUser } from '@/modules/auth';

interface PersonalInfoCardProps {
  user: SessionUser;
  isEditing: boolean;
  firstName: string;
  onFirstNameChange: (value: string) => void;
  lastName: string;
  onLastNameChange: (value: string) => void;
  phone: string;
  onPhoneChange: (value: string) => void;
  email: string;
  onEmailChange: (value: string) => void;
  saving: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
}

const ROLE_LABEL: Record<BankUserRole, string> = {
  [BankUserRole.BankAdmin]: 'Administrateur',
  [BankUserRole.Supervisor]: 'Responsable',
};

const ReadOnlyField: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <div className="mb-[7px] text-[11.5px] font-bold text-ink">{label}</div>
    <div className="truncate rounded-[11px] border border-line bg-card px-[13px] py-[11px] text-[13.5px] font-semibold text-ink">{value}</div>
  </div>
);

/** Informations personnelles — édition inline déclenchée par « Modifier ». Rôle non modifiable. Maquette A1/A2. */
export const PersonalInfoCard: React.FC<PersonalInfoCardProps> = ({
  user,
  isEditing,
  firstName,
  onFirstNameChange,
  lastName,
  onLastNameChange,
  phone,
  onPhoneChange,
  email,
  onEmailChange,
  saving,
  onEdit,
  onCancel,
  onSave,
}) => (
  <Card>
    <div className="flex items-center justify-between">
      <span className="text-[15px] font-extrabold text-ink">Informations personnelles</span>
      {!isEditing && (
        <button
          type="button"
          onClick={onEdit}
          className="bg-primary-soft cursor-pointer rounded-full px-3 py-1.5 text-xs font-bold text-primary hover:opacity-90"
        >
          Modifier
        </button>
      )}
    </div>

    <div className="mt-4 grid grid-cols-2 gap-3.5">
      {isEditing ? (
        <>
          <TextField label="Prénom" value={firstName} onChange={onFirstNameChange} required />
          <TextField label="Nom" value={lastName} onChange={onLastNameChange} required />
          <TextField label="Téléphone" value={phone} onChange={onPhoneChange} required />
          <TextField label="Email" value={email} onChange={onEmailChange} required />
        </>
      ) : (
        <>
          <ReadOnlyField label="Prénom" value={user.fullName.split(' ')[0] ?? ''} />
          <ReadOnlyField label="Nom" value={user.fullName.split(' ').slice(1).join(' ') || '—'} />
          <ReadOnlyField label="Téléphone" value={user.phone} />
          <ReadOnlyField label="Email" value={user.email} />
        </>
      )}
      <div className="col-span-2">
        <div className="mb-[7px] text-[11.5px] font-bold text-ink-disabled">Rôle &amp; périmètre · non modifiable</div>
        <div className="rounded-[11px] border border-line-soft bg-cream-50 px-[13px] py-[11px] text-[13.5px] font-semibold text-ink-muted">
          {ROLE_LABEL[user.role]} — {user.agency}
        </div>
      </div>
    </div>

    {isEditing && (
      <div className="mt-4 flex justify-end gap-2.5">
        <Button variant="secondary" onClick={onCancel}>
          Annuler
        </Button>
        <Button variant="primary" onClick={onSave} loading={saving}>
          Enregistrer
        </Button>
      </div>
    )}
  </Card>
);
