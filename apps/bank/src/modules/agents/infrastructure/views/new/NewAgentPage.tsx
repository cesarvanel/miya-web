import React from 'react';
import { Button, Card, Dropdown, MultiSelectChips, PhoneInput, TextField } from '@miya/ui';
import { PageShell } from '@/shared/layout/PageShell';
import { AgentRole } from '../../../domain/entities/Agent';
import { useNewAgent } from './useNewAgent';

const ROLE_LABELS: Record<AgentRole, string> = {
  [AgentRole.Collector]: 'Agent collecteur',
  [AgentRole.Supervisor]: 'Responsable',
};

/** Création d'un agent ou d'un responsable — identité, rôle & rattachement. Fidèle à la maquette 7d. */
export const NewAgentPage: React.FC = () => {
  const {
    fullName,
    setFullName,
    phone,
    setPhone,
    cniNumber,
    setCniNumber,
    role,
    setRole,
    isCollector,
    supervisorId,
    setSupervisorId,
    supervisors,
    agency,
    setAgency,
    zones,
    setZones,
    zoneOptions,
    canSubmit,
    submitting,
    error,
    submit,
    cancel,
  } = useNewAgent();

  return (
    <PageShell title="Nouvel agent" subtitle="Création du compte & rattachement" back={{ label: 'Agents', to: '/agents' }}>
      <div className="mx-auto flex max-w-3xl flex-col gap-4">
        <Card>
          <div className="mb-4 text-[15px] font-extrabold text-ink">Identité</div>
          <div className="grid grid-cols-2 gap-3.5">
            <TextField label="Nom complet" value={fullName} onChange={setFullName} placeholder="Ex. Fabrice Onana" required />
            <PhoneInput value={phone} onChange={setPhone} />
            <TextField label="N° CNI" value={cniNumber} onChange={setCniNumber} placeholder="Ex. 1120447356" required />
          </div>
        </Card>

        <Card className="border-2 border-primary shadow-primary-glow">
          <div className="mb-4 text-[15px] font-extrabold text-ink">Rôle &amp; rattachement</div>

          <div className="mb-4">
            <div className="mb-2 text-[11.5px] font-bold text-ink">
              Rôle <span className="text-danger">*</span>
            </div>
            <div className="flex gap-2">
              {Object.values(AgentRole).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRole(value)}
                  className={[
                    'cursor-pointer rounded-xl border px-4.5 py-2.75 text-[13.5px] font-bold transition',
                    value === role
                      ? 'border-primary bg-primary text-white'
                      : 'border-line bg-cream-50 text-ink-muted hover:bg-cream-100',
                  ].join(' ')}
                >
                  {ROLE_LABELS[value]}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <TextField label="Agence" value={agency} onChange={setAgency} required />
            {isCollector && (
              <div>
                <div className="mb-1.75 text-[11.5px] font-bold text-ink">
                  Responsable rattaché <span className="text-danger">*</span>
                </div>
                <Dropdown
                  options={[
                    { value: '', label: 'Sélectionner un responsable' },
                    ...supervisors.map((supervisor) => ({ value: supervisor.id, label: supervisor.fullName })),
                  ]}
                  value={supervisorId}
                  onChange={setSupervisorId}
                  aria-label="Responsable rattaché"
                />
              </div>
            )}
          </div>

          <div className="mt-3.5">
            <div className="mb-1.75 text-[11.5px] font-bold text-ink">
              Zones d&rsquo;affectation <span className="text-danger">*</span>
            </div>
            <MultiSelectChips
              options={zoneOptions.map((zone) => ({ value: zone, label: zone }))}
              value={zones}
              onChange={setZones}
              placeholder="+ ajouter une zone…"
            />
          </div>

          <div className="rounded-tile mt-4 bg-primary-soft px-[13px] py-[11px] text-xs font-semibold text-primary">
            À la création, un code d&rsquo;activation est généré pour lier le téléphone de l&rsquo;agent.
          </div>
        </Card>

        {error && (
          <div className="rounded-tile bg-danger/10 px-[13px] py-[11px] text-xs font-semibold text-danger">{error}</div>
        )}

        <div className="flex justify-end gap-2.5">
          <Button variant="secondary" onClick={cancel}>
            Annuler
          </Button>
          <Button variant="primary" onClick={submit} disabled={!canSubmit} loading={submitting}>
            Créer &amp; générer le code
          </Button>
        </div>
      </div>
    </PageShell>
  );
};
