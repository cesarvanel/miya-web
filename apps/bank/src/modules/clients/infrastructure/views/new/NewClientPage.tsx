import React from 'react';
import { AmountInput, Button, Card, Dropdown, PhoneInput, TextField, Toggle } from '@miya/ui';
import { PageShell } from '@/shared/layout/PageShell';
import { ClientPlanFrequency } from '../../../domain/entities/Client';
import { useNewClient } from './useNewClient';

const FREQUENCY_LABELS: Record<ClientPlanFrequency, string> = {
  [ClientPlanFrequency.Daily]: 'Journalière',
  [ClientPlanFrequency.EveryTwoDays]: 'Tous les 2 jours',
  [ClientPlanFrequency.Weekly]: 'Hebdomadaire',
};

/** Onboarding nouveau client — identité, plan de cotisation, affectation. Fidèle à la maquette 6b. */
export const NewClientPage: React.FC = () => {
  const {
    fullName,
    setFullName,
    phone,
    setPhone,
    cniNumber,
    setCniNumber,
    activity,
    setActivity,
    frequency,
    setFrequency,
    usualAmount,
    setUsualAmount,
    isBelowFloor,
    floorAmount,
    ceilingHint,
    zone,
    setZone,
    zones,
    agentId,
    setAgentId,
    agents,
    hasSmartphone,
    setHasSmartphone,
    canSubmit,
    submitting,
    error,
    submit,
    cancel,
  } = useNewClient();

  return (
    <PageShell
      title="Nouveau client"
      subtitle="Enregistrement & vérification KYC"
      back={{ label: 'Clients', to: '/clients' }}
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-4">
        <Card>
          <div className="mb-4 text-[15px] font-extrabold text-ink">Identité</div>
          <div className="grid grid-cols-2 gap-3.5">
            <TextField label="Nom complet" value={fullName} onChange={setFullName} placeholder="Ex. Bernadette Ngo" required />
            <PhoneInput value={phone} onChange={setPhone} />
            <TextField label="N° CNI" value={cniNumber} onChange={setCniNumber} placeholder="Ex. 108455201" required />
            <TextField label="Activité" value={activity} onChange={setActivity} placeholder="Ex. Vendeuse de beignets" required />
          </div>
        </Card>

        <Card className="border-2 border-primary shadow-primary-glow">
          <div className="mb-4 text-[15px] font-extrabold text-ink">Plan de cotisation</div>

          <div className="mb-4">
            <div className="mb-2 text-[11.5px] font-bold text-ink">
              Fréquence <span className="text-danger">*</span>
            </div>
            <div className="flex gap-2">
              {Object.values(ClientPlanFrequency).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFrequency(value)}
                  className={[
                    'cursor-pointer rounded-xl border px-4.5 py-2.75 text-[13.5px] font-bold transition',
                    value === frequency
                      ? 'border-primary bg-primary text-white'
                      : 'border-line bg-cream-50 text-ink-muted hover:bg-cream-100',
                  ].join(' ')}
                >
                  {FREQUENCY_LABELS[value]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-2 text-[11.5px] font-bold text-ink">
              Montant habituel <span className="text-danger">*</span>
            </div>
            <AmountInput value={usualAmount} onChange={setUsualAmount} error={isBelowFloor} aria-label="Montant habituel" />
            <div className="mt-1.5 text-[11.5px] font-semibold text-ink-faint">
              Plancher {floorAmount.toLocaleString('fr-FR')} — {ceilingHint.toLocaleString('fr-FR')} FCFA
            </div>
            {isBelowFloor && (
              <div className="mt-1.5 text-[11.5px] font-semibold text-danger">
                Le montant doit être supérieur ou égal au plancher.
              </div>
            )}
          </div>
        </Card>

        <Card>
          <div className="mb-4 text-[15px] font-extrabold text-ink">Affectation</div>
          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <div className="mb-1.75 text-[11.5px] font-bold text-ink">
                Zone <span className="text-danger">*</span>
              </div>
              <Dropdown
                options={[{ value: '', label: 'Sélectionner une zone' }, ...zones.map((z) => ({ value: z, label: z }))]}
                value={zone}
                onChange={setZone}
                aria-label="Zone"
              />
            </div>
            <div>
              <div className="mb-1.75 text-[11.5px] font-bold text-ink">
                Agent collecteur <span className="text-danger">*</span>
              </div>
              <Dropdown
                options={[
                  { value: '', label: 'Sélectionner un agent' },
                  ...agents.map((agent) => ({ value: agent.agentId, label: agent.name })),
                ]}
                value={agentId}
                onChange={setAgentId}
                aria-label="Agent collecteur"
              />
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-line-soft pt-4">
            <div>
              <div className="text-[13.5px] font-bold text-ink">Cliente équipée d'un smartphone</div>
              <div className="text-[11.5px] font-medium text-ink-faint">Désactivez si la cliente n'a pas de smartphone.</div>
            </div>
            <Toggle checked={hasSmartphone} onChange={setHasSmartphone} aria-label="Cliente équipée d'un smartphone" />
          </div>

          {!hasSmartphone && (
            <div className="rounded-tile mt-3.5 bg-primary-soft px-[13px] py-[11px] text-xs font-semibold text-primary">
              Une carte QR sera générée automatiquement à la création — la cliente l'utilisera pour ses collectes.
            </div>
          )}
        </Card>

        {error && (
          <div className="rounded-tile bg-danger/10 px-[13px] py-[11px] text-xs font-semibold text-danger">{error}</div>
        )}

        <div className="flex justify-end gap-2.5">
          <Button variant="secondary" onClick={cancel}>
            Annuler
          </Button>
          <Button variant="primary" onClick={submit} disabled={!canSubmit} loading={submitting}>
            Créer & générer la carte
          </Button>
        </div>
      </div>
    </PageShell>
  );
};
