/**
 * Page vitrine TEMPORAIRE (dev uniquement) — route /design-system.
 * Montre chaque composant de libs/ui dans tous ses états pour comparaison
 * côte à côte avec les maquettes design/Miya Web - Spec.dc.html.
 * À supprimer quand les vraies pages couvriront tous les composants.
 */
import React, { useState } from 'react';
import {
  AmountInput,
  Button,
  Card,
  EmptyState,
  Gauge,
  InitialsAvatar,
  Modal,
  SearchInput,
  Skeleton,
  StatusBadge,
  Table,
  Tabs,
  Toast,
  Toaster,
  type CollectionStatus,
  type TableColumn,
  type ToastData,
} from '@miya/ui';

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, children }) => (
  <section className="mt-10">
    <h2 className="text-lg font-extrabold text-ink">{title}</h2>
    <div className="mt-4">{children}</div>
  </section>
);

interface AgentRow {
  id: string;
  name: string;
  amount: number;
  status: CollectionStatus;
}

const agentRows: AgentRow[] = [
  { id: '1', name: 'Cédric Nkoulou', amount: 52000, status: 'collected' },
  { id: '2', name: 'Grace Atangana', amount: 39000, status: 'disputed' },
  { id: '3', name: 'Rosalie Fouda', amount: 61500, status: 'pending' },
  { id: '4', name: 'Ibrahim Sali', amount: 44500, status: 'collected' },
  { id: '5', name: 'JB Owona', amount: 0, status: 'absent' },
];

const agentColumns: TableColumn<AgentRow>[] = [
  {
    key: 'name',
    header: 'Agent',
    sortValue: (row) => row.name,
    cell: (row) => (
      <span className="flex items-center gap-3">
        <InitialsAvatar name={row.name} size="sm" />
        <span className="font-bold">{row.name}</span>
      </span>
    ),
  },
  {
    key: 'amount',
    header: 'Collecté',
    align: 'right',
    sortValue: (row) => row.amount,
    cell: (row) => (
      <span className="num font-bold">
        {row.amount === 0 ? '—' : `${row.amount.toLocaleString('fr-FR').replace(/[\u202F\u00A0]/g, ' ')} FCFA`}
      </span>
    ),
  },
  {
    key: 'status',
    header: 'Statut',
    align: 'right',
    cell: (row) => <StatusBadge status={row.status} />,
  },
];

const statuses: CollectionStatus[] = [
  'collected',
  'pending',
  'disputed',
  'rejected',
  'absent',
  'postponed',
];

let toastSeq = 0;

export const DesignSystemPage: React.FC = () => {
  const [amount, setAmount] = useState<number | null>(127500);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('open');
  const [isModalOpen, setModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const pushToast = (variant: ToastData['variant'], title: string): void => {
    toastSeq += 1;
    setToasts((current) => [
      ...current,
      { id: String(toastSeq), variant, title, message: 'Exemple de notification empilée.' },
    ]);
  };

  return (
    <div className="min-h-screen bg-cream px-10 py-8">
      <header>
        <h1 className="text-[26px] font-extrabold text-ink">
          Design system <span className="text-primary">Miya</span>
        </h1>
        <p className="mt-1 text-sm font-medium text-ink-muted">
          Page de dev temporaire — composants @miya/ui dans tous leurs états,
          à comparer avec design/Miya Web - Spec.dc.html.
        </p>
      </header>

      <Section title="Button">
        <div className="flex flex-wrap items-center gap-3">
          <Button>Valider le reversement</Button>
          <Button variant="secondary">Annuler</Button>
          <Button variant="destructive">Confirmer le rejet</Button>
          <Button variant="ghost">Plus tard</Button>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <Button loading>Validation…</Button>
          <Button variant="secondary" disabled>
            Annuler
          </Button>
          <Button size="sm">Résolution</Button>
          <Button size="sm" variant="destructive">
            Traiter
          </Button>
        </div>
      </Section>

      <Section title="StatusBadge">
        <div className="flex flex-wrap items-center gap-3">
          {statuses.map((status) => (
            <StatusBadge key={status} status={status} />
          ))}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          {statuses.map((status) => (
            <StatusBadge key={status} status={status} size="sm" />
          ))}
          <StatusBadge status="pending">1 LITIGE</StatusBadge>
        </div>
      </Section>

      <Section title="InitialsAvatar">
        <div className="flex flex-wrap items-end gap-3">
          {agentRows.map((row) => (
            <InitialsAvatar key={row.id} name={row.name} />
          ))}
          <InitialsAvatar name="Cédric Nkoulou" size="sm" />
          <InitialsAvatar name="Cédric Nkoulou" size="lg" />
        </div>
      </Section>

      <Section title="Card">
        <div className="grid max-w-3xl grid-cols-3 gap-4">
          <Card>
            <div className="text-[12.5px] font-semibold text-ink-muted">Collecté</div>
            <div className="num mt-1 text-2xl font-bold">
              127 500 <span className="text-xs text-ink-disabled">FCFA</span>
            </div>
          </Card>
          <Card padding="sm">
            <div className="text-[12.5px] font-semibold text-ink-muted">padding sm</div>
          </Card>
          <Card padding="none">
            <div className="p-3 text-[12.5px] font-semibold text-ink-muted">
              padding none
            </div>
          </Card>
        </div>
      </Section>

      <Section title="Table (tri par en-tête, hover, état vide)">
        <Table columns={agentColumns} rows={agentRows} rowKey={(row) => row.id} />
        <div className="mt-4">
          <Table
            columns={agentColumns}
            rows={[]}
            rowKey={(row: AgentRow) => row.id}
            emptyState={
              <EmptyState
                title="Aucun agent"
                description="Les agents apparaîtront ici dès l'ouverture des tournées."
              />
            }
          />
        </div>
      </Section>

      <Section title="Tabs">
        <Tabs
          items={[
            { id: 'open', label: 'Ouvertes', count: 3 },
            { id: 'resolved', label: 'Résolues' },
            { id: 'all', label: 'Toutes' },
          ]}
          activeId={activeTab}
          onChange={setActiveTab}
        />
      </Section>

      <Section title="SearchInput">
        <SearchInput value={search} onChange={setSearch} />
      </Section>

      <Section title="AmountInput (formatage FCFA en saisie)">
        <div className="flex items-center gap-3">
          <AmountInput value={amount} onChange={setAmount} aria-label="Montant" />
          <AmountInput
            value={44500}
            onChange={() => undefined}
            disabled
            aria-label="Montant désactivé"
          />
        </div>
      </Section>

      <Section title="Gauge (plafond, seuil ambre à 80 %)">
        <div className="grid max-w-3xl gap-4">
          <Gauge
            value={40000}
            max={100000}
            label="Cash en main · plafond de détention"
          />
          <Gauge
            value={85000}
            max={100000}
            label="Cash en main · plafond de détention"
            hint="À 15 000 FCFA du plafond — un dépôt partiel libère de la capacité pour continuer."
          />
          <Gauge value={100000} max={100000} label="Plafond atteint" />
        </div>
      </Section>

      <Section title="Skeleton">
        <div className="grid max-w-3xl grid-cols-2 gap-4">
          <Skeleton variant="card" />
          <Skeleton variant="chart" />
        </div>
        <div className="mt-4 max-w-3xl overflow-hidden rounded-card border border-line">
          <Skeleton variant="row" />
          <Skeleton variant="row" />
          <Skeleton variant="row" />
        </div>
      </Section>

      <Section title="Toast (4 variantes)">
        <div className="flex flex-wrap gap-4">
          <Toast
            variant="success"
            title="Quittance QT-0703-014 émise"
            message="Envoyée à Ibrahim Sali · reçue sur son téléphone"
          />
          <Toast
            variant="error"
            title="Reversement rejeté"
            message="Écart non justifié de 500 FCFA"
          />
          <Toast
            variant="warning"
            title="Plafond bientôt atteint"
            message="À 15 000 FCFA du plafond de détention"
          />
          <Toast
            variant="info"
            title="Nouvelle contestation"
            message="Marthe Essomba conteste le total du 3 juillet"
          />
        </div>
        <div className="mt-4 flex gap-3">
          <Button size="sm" onClick={() => pushToast('success', 'Reversement validé')}>
            Toast succès
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => pushToast('error', 'Reversement rejeté')}
          >
            Toast erreur
          </Button>
        </div>
      </Section>

      <Section title="Modal (overlay + fade/scale 200 ms)">
        <Button onClick={() => setModalOpen(true)}>Ouvrir la modale</Button>
        <Modal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          ariaLabel="Démo modale"
        >
          <div className="text-center">
            <div className="text-2xl font-extrabold text-ink">Reversement validé</div>
            <p className="mt-2 text-sm font-medium text-ink-muted">
              Validation croisée confirmée. L'agent reçoit sa quittance
              instantanément.
            </p>
            <div className="mt-5 flex gap-3">
              <Button variant="secondary" className="flex-1" onClick={() => setModalOpen(false)}>
                Annuler
              </Button>
              <Button className="flex-[1.4]" onClick={() => setModalOpen(false)}>
                Confirmer
              </Button>
            </div>
          </div>
        </Modal>
      </Section>

      <Section title="EmptyState">
        <Card padding="none">
          <EmptyState
            title="Tous les reversements sont validés"
            description="Les 6 agents ont clôturé leur journée et remis leur cash. Chaque quittance a été scellée par validation croisée. Rien ne reste en attente."
            action={<Button variant="secondary">Voir le récapitulatif</Button>}
          />
        </Card>
      </Section>

      <Toaster
        toasts={toasts}
        onDismiss={(id) =>
          setToasts((current) => current.filter((toast) => toast.id !== id))
        }
      />
    </div>
  );
};
