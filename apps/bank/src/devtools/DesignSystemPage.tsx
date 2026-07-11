/**
 * Page vitrine TEMPORAIRE (dev uniquement) — route /design-system.
 * Montre chaque composant de libs/ui dans tous ses états pour comparaison
 * côte à côte avec les maquettes design/tokens/MIYA-WEB.spec.html.
 * À supprimer quand les vraies pages couvriront tous les composants.
 */
import React, { useState } from 'react';
import { useFreshness } from '@miya/kernel';
import {
  ActionMenu,
  AmountInput,
  Button,
  Card,
  Checkbox,
  ConfirmDialog,
  DateRangePicker,
  Drawer,
  Dropdown,
  EmptyState,
  FilterChips,
  FlashValue,
  FreshnessIndicator,
  Gauge,
  InitialsAvatar,
  LiveBadge,
  Modal,
  MultiSelectChips,
  NotificationBell,
  NotificationPanel,
  Pagination,
  PhoneInput,
  ProgressBar,
  RadioGroup,
  SearchableSelect,
  SearchInput,
  Skeleton,
  StatusBadge,
  Table,
  Tabs,
  TextField,
  Textarea,
  Toast,
  Toaster,
  Toggle,
  type CollectionStatus,
  type DateRange,
  type DateRangePreset,
  type FilterChip,
  type NotificationItem,
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
        {row.amount === 0 ? '—' : `${row.amount.toLocaleString('fr-FR').replace(/\s/g, ' ')} FCFA`}
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

interface ClientOption {
  id: string;
  name: string;
  phone: string;
  code: string;
}

const clientOptions: ClientOption[] = [
  { id: 'c1', name: 'Bernadette Fouda', phone: '6 77 12', code: '#MOK-0412' },
  { id: 'c2', name: 'Bernard Ngo', phone: '6 91 55', code: '#MOK-0987' },
];

const zoneOptions = [
  { value: 'all', label: 'Toutes les zones' },
  { value: 'mokolo-centre', label: 'Mokolo-Centre' },
  { value: 'marche-mokolo', label: 'Marché Mokolo' },
  { value: 'mokolo-est', label: 'Mokolo-Est' },
];

const notificationItems: NotificationItem[] = [
  {
    id: 'n1',
    title: 'Nouvelle contestation — litige #214',
    meta: 'Grace Atangana · il y a 4 min',
    tone: 'success',
    read: false,
  },
  {
    id: 'n2',
    title: 'Reversement en attente depuis 2 h',
    meta: 'Ibrahim S. · il y a 12 min',
    tone: 'warning',
    read: false,
  },
  {
    id: 'n3',
    title: 'Journée clôturée — JB. Owona',
    meta: 'il y a 1 h',
    tone: 'neutral',
    read: true,
  },
];

let toastSeq = 0;

export const DesignSystemPage: React.FC = () => {
  const [amount, setAmount] = useState<number | null>(127500);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('open');
  const [isModalOpen, setModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const [zone, setZone] = useState('all');
  const [client, setClient] = useState<ClientOption | null>(null);
  const [zones, setZones] = useState<string[]>(['mokolo-centre']);
  const [tablePage, setTablePage] = useState(1);

  const [dateRange, setDateRange] = useState<DateRange>({
    start: new Date(Date.now() - 29 * 86_400_000),
    end: new Date(),
  });
  const [datePreset, setDatePreset] = useState<DateRangePreset>('last30');

  const [filters, setFilters] = useState<FilterChip[]>([
    { id: 'zone', label: 'Zone : Mokolo' },
    { id: 'status', label: 'Statut : Actif' },
    { id: 'regularity', label: 'Régularité ≥ 90 %', emphasis: true },
  ]);

  const [textValue, setTextValue] = useState('Bernadette Fouda');
  const [phoneDigits, setPhoneDigits] = useState('677124509');
  const [toggleOn, setToggleOn] = useState(true);
  const [checkbox, setCheckbox] = useState<boolean | 'indeterminate'>(true);
  const [radioValue, setRadioValue] = useState('daily');
  const [reasonText, setReasonText] = useState('');

  const [isConfirmOpen, setConfirmOpen] = useState(false);
  const [isDestructiveOpen, setDestructiveOpen] = useState(false);
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const [counter, setCounter] = useState(214700);
  const [fetchedAt, setFetchedAt] = useState<number | null>(() => Date.now());
  const [isPending, setPending] = useState(false);
  const freshness = useFreshness(fetchedAt, isPending);

  const pushToast = (variant: ToastData['variant'], title: string): void => {
    toastSeq += 1;
    setToasts((current) => [
      ...current,
      { id: String(toastSeq), variant, title, message: 'Exemple de notification empilée.' },
    ]);
  };

  const simulateRefresh = (): void => {
    setPending(true);
    setTimeout(() => {
      setPending(false);
      setFetchedAt(Date.now());
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-cream px-10 py-8">
      <header>
        <h1 className="text-[26px] font-extrabold text-ink">
          Design system <span className="text-primary">Miya</span>
        </h1>
        <p className="mt-1 text-sm font-medium text-ink-muted">
          Page de dev temporaire — composants @miya/ui dans tous leurs états,
          à comparer avec design/tokens/MIYA-WEB.spec.html.
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

      <Section title="1 — Dropdown">
        <div className="flex flex-wrap items-start gap-8">
          <Dropdown options={zoneOptions} value={zone} onChange={setZone} aria-label="Filtre par zone" />
          <Dropdown options={zoneOptions} value="mokolo-centre" onChange={() => undefined} disabled />
        </div>
      </Section>

      <Section title="1 — SearchableSelect (recherche intégrée)">
        <div className="max-w-xs">
          <SearchableSelect
            options={clientOptions}
            value={client}
            onChange={setClient}
            getId={(option) => option.id}
            getLabel={(option) => option.name}
            placeholder="Sélectionner un client…"
            searchPlaceholder="Rechercher un client…"
            renderOption={(option) => (
              <>
                <InitialsAvatar name={option.name} size="sm" />
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] font-bold text-ink">{option.name}</span>
                  <span className="num block text-[11px] font-medium text-ink-faint">
                    {option.phone} · {option.code}
                  </span>
                </span>
              </>
            )}
            renderValue={(option) => (
              <>
                <InitialsAvatar name={option.name} size="sm" />
                <span className="truncate text-[13.5px] font-bold text-ink">{option.name}</span>
              </>
            )}
          />
        </div>
      </Section>

      <Section title="1 — MultiSelectChips">
        <div className="max-w-sm">
          <MultiSelectChips options={zoneOptions.slice(1)} value={zones} onChange={setZones} />
        </div>
      </Section>

      <Section title="1 — ActionMenu (⋯ avec action destructive séparée)">
        <ActionMenu
          aria-label="Actions agent"
          items={[
            { id: 'view', label: 'Voir la fiche', onClick: () => undefined },
            { id: 'edit', label: 'Modifier', onClick: () => undefined },
            { id: 'suspend', label: "Suspendre l'accès", destructive: true, onClick: () => undefined },
          ]}
        />
      </Section>

      <Section title="2 — DateRangePicker (presets + plage personnalisée, lundi → dimanche)">
        <DateRangePicker
          value={dateRange}
          presetId={datePreset}
          onApply={(range, presetId) => {
            setDateRange(range);
            setDatePreset(presetId);
          }}
        />
      </Section>

      <Section title="3 — Skeleton (shimmer)">
        <div className="grid max-w-3xl grid-cols-2 gap-4">
          <Skeleton variant="card" />
          <Skeleton variant="chart" />
        </div>
        <div className="mt-4 grid max-w-3xl grid-cols-2 gap-4">
          <Skeleton variant="activity" />
          <div className="overflow-hidden rounded-card border border-line">
            <Skeleton variant="row" />
            <Skeleton variant="row" />
            <Skeleton variant="row" />
          </div>
        </div>
      </Section>

      <Section title="3 — ProgressBar (indéterminée / déterminée)">
        <div className="max-w-md space-y-4">
          <ProgressBar mode="indeterminate" />
          <ProgressBar mode="determinate" value={62} />
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

      <Section title="4 — NotificationBell (sans / point / compteur / actif)">
        <div className="flex flex-wrap items-center gap-4">
          <NotificationBell variant="none" />
          <NotificationBell variant="dot" />
          <NotificationBell variant="count" count={7} />
          <NotificationBell variant="count" count={7} active />
        </div>
      </Section>

      <Section title="4 — NotificationPanel">
        <NotificationPanel
          items={notificationItems}
          onMarkAllRead={() => undefined}
          onViewAll={() => undefined}
        />
      </Section>

      <Section title="5 — Table (tri, hover, sélection, pagination)">
        <FilterChips
          filters={filters}
          onRemove={(id) => setFilters((current) => current.filter((f) => f.id !== id))}
          onClearAll={() => setFilters([])}
        />
        <div className="mt-4">
          <Table
            columns={agentColumns}
            rows={agentRows}
            rowKey={(row) => row.id}
            selectedRowKey="3"
            pagination={{
              page: tablePage,
              pageCount: 5,
              onChange: setTablePage,
              totalItems: 1284,
              pageSize: 20,
              itemLabel: 'clients',
            }}
          />
        </div>
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
        <div className="flex flex-wrap items-center gap-3">
          <AmountInput value={amount} onChange={setAmount} aria-label="Montant" />
          <AmountInput
            value={44500}
            onChange={() => undefined}
            disabled
            aria-label="Montant désactivé"
          />
          <AmountInput
            value={5}
            onChange={() => undefined}
            error
            aria-label="Montant en erreur"
          />
        </div>
      </Section>

      <Section title="6 — Formulaires (champs)">
        <div className="grid max-w-4xl grid-cols-3 gap-6">
          <TextField label="Nom du client" value={textValue} onChange={setTextValue} />
          <TextField label="Nom du client" value="B" onChange={() => undefined} error="Au moins 2 caractères" />
          <TextField label="Nom du client" value="Verrouillé" onChange={() => undefined} disabled />
        </div>
        <div className="mt-6 flex flex-wrap items-start gap-8">
          <PhoneInput value={phoneDigits} onChange={setPhoneDigits} />
          <div>
            <div className="mb-[14px] text-[13px] font-extrabold text-ink">Toggle / switch</div>
            <div className="flex items-center gap-6">
              <Toggle checked={toggleOn} onChange={setToggleOn} label={toggleOn ? 'Activé' : 'Désactivé'} />
              <Toggle checked={false} onChange={() => undefined} disabled label="Verrouillé" />
            </div>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap items-start gap-14">
          <div>
            <div className="mb-[14px] text-[13px] font-extrabold text-ink">Boutons radio</div>
            <RadioGroup
              value={radioValue}
              onChange={setRadioValue}
              options={[
                { value: 'daily', label: 'Dépôt quotidien' },
                { value: 'weekly', label: 'Dépôt hebdomadaire' },
              ]}
            />
          </div>
          <div>
            <div className="mb-[14px] text-[13px] font-extrabold text-ink">Cases à cocher</div>
            <div className="flex flex-col gap-[11px]">
              <Checkbox checked={checkbox === true} onChange={setCheckbox} label="KYC vérifié" />
              <Checkbox checked={false} onChange={() => undefined} label="Recevoir un reçu SMS" />
              <Checkbox
                checked="indeterminate"
                onChange={() => undefined}
                label={<>Toutes les zones <span className="font-medium text-ink-faint">(partiel)</span></>}
              />
            </div>
          </div>
          <div className="min-w-[320px] flex-1">
            <Textarea
              label="Motif de la suspension"
              value={reasonText}
              onChange={setReasonText}
              maxLength={280}
              required
              hint="Champ requis"
              placeholder="Décrivez le motif…"
            />
          </div>
        </div>
      </Section>

      <Section title="7 — ConfirmDialog (standard / destructive)">
        <div className="flex gap-3">
          <Button onClick={() => setConfirmOpen(true)}>Valider le reversement</Button>
          <Button variant="destructive" onClick={() => setDestructiveOpen(true)}>
            Suspendre l'accès
          </Button>
        </div>
        <ConfirmDialog
          isOpen={isConfirmOpen}
          onClose={() => setConfirmOpen(false)}
          onConfirm={() => setConfirmOpen(false)}
          title="Valider le reversement ?"
          description={
            <>
              Le bordereau <b className="num text-ink">#4471</b> de Grace Atangana (
              <b className="num text-ink">128 500 FCFA</b>) sera enregistré et clôturé.
            </>
          }
          confirmLabel="Valider"
        />
        <ConfirmDialog
          isOpen={isDestructiveOpen}
          onClose={() => setDestructiveOpen(false)}
          onConfirm={() => setDestructiveOpen(false)}
          title="Suspendre l'accès de Cédric N. ?"
          description="Il ne pourra plus collecter tant que l'accès n'est pas rétabli. Cette action est tracée."
          tone="destructive"
          reasonLabel="Motif"
          confirmLabel="Suspendre"
        />
      </Section>

      <Section title="7 — Drawer (aperçu rapide)">
        <Button variant="secondary" onClick={() => setDrawerOpen(true)}>
          Ouvrir l'aperçu client
        </Button>
        <Drawer isOpen={isDrawerOpen} onClose={() => setDrawerOpen(false)} title="Aperçu client">
          <div className="flex items-center gap-[13px]">
            <InitialsAvatar name="Bernadette Fouda" size="lg" />
            <div>
              <div className="text-base font-extrabold text-ink">Bernadette Fouda</div>
              <div className="num text-xs font-semibold text-ink-faint">#MOK-0412 · 6 77 12 45 09</div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-[10px]">
            <Card>
              <div className="text-[11.5px] font-semibold text-ink-faint">Solde</div>
              <div className="num mt-1 text-[19px] font-bold text-ink">88 000</div>
            </Card>
            <Card>
              <div className="text-[11.5px] font-semibold text-ink-faint">Régularité</div>
              <div className="num mt-1 text-[19px] font-bold text-primary">91 %</div>
            </Card>
          </div>
        </Drawer>
      </Section>

      <Section title="8 — États temps réel">
        <div className="flex flex-wrap items-start gap-10">
          <div>
            <div className="mb-[14px] text-[13px] font-extrabold text-ink">Pastille « en direct »</div>
            <LiveBadge />
          </div>
          <div>
            <div className="mb-[14px] text-[13px] font-extrabold text-ink">Compteur qui vient de changer</div>
            <div className="flex items-center gap-3">
              <Card>
                <div className="text-xs font-semibold text-ink-muted">Total collecté</div>
                <FlashValue
                  value={
                    <div className="num mt-1.5 text-2xl font-bold text-ink">
                      {counter.toLocaleString('fr-FR').replace(/\s/g, ' ')}
                    </div>
                  }
                  flashKey={counter}
                />
              </Card>
              <Button size="sm" variant="secondary" onClick={() => setCounter((n) => n + 500)}>
                Simuler +500
              </Button>
            </div>
          </div>
          <div>
            <div className="mb-[14px] text-[13px] font-extrabold text-ink">Indicateur de fraîcheur</div>
            <div className="flex items-center gap-3">
              <FreshnessIndicator status={freshness.status} label={freshness.label} />
              <Button size="sm" variant="secondary" onClick={simulateRefresh}>
                Rafraîchir
              </Button>
            </div>
          </div>
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

      <Section title="Pagination (autonome)">
        <Pagination page={2} pageCount={65} onChange={() => undefined} totalItems={1284} pageSize={20} itemLabel="clients" />
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
