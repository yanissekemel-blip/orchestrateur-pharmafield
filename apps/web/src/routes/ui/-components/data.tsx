import { Badge } from '@orchestrateur-pharmafield/ui/badge';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@orchestrateur-pharmafield/ui/chart';
import { ChartCard } from '@orchestrateur-pharmafield/ui/chart-card';
import {
  KanbanBoard,
  KanbanCard,
  KanbanCardDate,
  KanbanCardFooter,
  KanbanCardMeta,
  KanbanCardTitle,
  KanbanLane,
} from '@orchestrateur-pharmafield/ui/kanban';
import { MetricStrip } from '@orchestrateur-pharmafield/ui/metric-strip';
import { PriorityIndicator } from '@orchestrateur-pharmafield/ui/priority-indicator';
import { Progress } from '@orchestrateur-pharmafield/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@orchestrateur-pharmafield/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableDraggableHead,
  TableHeader,
  TableRow,
} from '@orchestrateur-pharmafield/ui/table';
import {
  TableAvatar,
  TableIdentity,
} from '@orchestrateur-pharmafield/ui/table-cells';
import { TablePagination } from '@orchestrateur-pharmafield/ui/table-pagination';
import {
  TableBulkActions,
  TableSelectCell,
  TableSelectHead,
} from '@orchestrateur-pharmafield/ui/table-selection';
import {
  TableLoadingRows,
  TableStateRow,
} from '@orchestrateur-pharmafield/ui/table-state';
import {
  Activity,
  Building2,
  CircleDashed,
  Mail,
  Megaphone,
  Users,
  UsersRound,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from 'recharts';
import type { CatalogGroup } from './catalog-types';

const chartData = [
  { month: 'janv.', sent: 120, replies: 22 },
  { month: 'févr.', sent: 168, replies: 34 },
  { month: 'mars', sent: 142, replies: 29 },
  { month: 'avr.', sent: 231, replies: 48 },
  { month: 'mai', sent: 256, replies: 62 },
];
const chartConfig = {
  sent: { label: 'Messages envoyés', color: 'var(--brand-ink)' },
  replies: { label: 'Réponses', color: 'var(--accent-2)' },
} satisfies ChartConfig;

const campaigns = [
  { name: 'Campagne de printemps', status: 'Active', contacts: 418 },
  { name: 'Relance clients', status: 'En pause', contacts: 132 },
  { name: 'Newsletter hebdomadaire', status: 'Brouillon', contacts: 203 },
  { name: 'Présentation aux partenaires', status: 'Active', contacts: 87 },
  { name: 'Nouveautés produit', status: 'Brouillon', contacts: 59 },
  { name: 'Rappels de renouvellement', status: 'Active', contacts: 311 },
];

type TableMode = 'data' | 'loading' | 'empty' | 'filtered' | 'error';

function TablePreview() {
  const [mode, setMode] = useState<TableMode>('data');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(3);
  const [sort, setSort] = useState<'asc' | 'desc'>('asc');
  const [columnOrder, setColumnOrder] = useState([
    'campaign',
    'status',
    'contacts',
  ]);
  const [selected, setSelected] = useState<string[]>([]);
  const sorted = useMemo(
    () =>
      [...campaigns].sort(
        (a, b) => a.name.localeCompare(b.name) * (sort === 'asc' ? 1 : -1),
      ),
    [sort],
  );
  const rows = sorted.slice((page - 1) * pageSize, page * pageSize);
  const selectedOnPage = rows.filter((row) =>
    selected.includes(row.name),
  ).length;

  function toggleAll(checked: boolean) {
    const visible = rows.map((row) => row.name);
    setSelected((current) =>
      checked
        ? [...new Set([...current, ...visible])]
        : current.filter((name) => !visible.includes(name)),
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-[var(--radius-card)] border border-[var(--line)]">
      <div className="flex flex-wrap items-center justify-between gap-2 bg-pharmafield-panel-2 px-3 py-2">
        <p className="text-xs font-bold">Campagnes</p>
        <Select
          value={mode}
          onValueChange={(value) => {
            setMode(value as TableMode);
            setSelected([]);
          }}
        >
          <SelectTrigger className="w-40" aria-label="État du tableau">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="data">Avec données</SelectItem>
            <SelectItem value="loading">Chargement</SelectItem>
            <SelectItem value="empty">Vide</SelectItem>
            <SelectItem value="filtered">Aucune correspondance</SelectItem>
            <SelectItem value="error">Erreur</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <TableBulkActions
        count={mode === 'data' ? selected.length : 0}
        onClear={() => setSelected([])}
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableSelectHead
              checked={
                selectedOnPage === rows.length
                  ? true
                  : selectedOnPage > 0
                    ? 'indeterminate'
                    : false
              }
              disabled={mode !== 'data'}
              onCheckedChange={toggleAll}
            />
            {columnOrder.map((id) => (
              <TableDraggableHead
                key={id}
                columnId={id}
                icon={
                  id === 'campaign'
                    ? Megaphone
                    : id === 'status'
                      ? CircleDashed
                      : UsersRound
                }
                order={columnOrder}
                onOrderChange={setColumnOrder}
                direction={id === 'campaign' ? sort : null}
                onSort={
                  id === 'campaign'
                    ? () =>
                        setSort((current) =>
                          current === 'asc' ? 'desc' : 'asc',
                        )
                    : undefined
                }
              >
                {id === 'campaign'
                  ? 'Campagne'
                  : id === 'status'
                    ? 'Statut'
                    : 'Contacts'}
              </TableDraggableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {mode === 'data' ? (
            rows.map((row) => (
              <TableRow key={row.name}>
                <TableSelectCell
                  label={`Sélectionner ${row.name}`}
                  checked={selected.includes(row.name)}
                  onCheckedChange={(checked) =>
                    setSelected((current) =>
                      checked
                        ? [...current, row.name]
                        : current.filter((name) => name !== row.name),
                    )
                  }
                />
                {columnOrder.map((id) => (
                  <TableCell
                    key={id}
                    className={id === 'campaign' ? 'font-medium' : undefined}
                    label={
                      id === 'campaign'
                        ? undefined
                        : id === 'status'
                          ? 'Statut'
                          : 'Contacts'
                    }
                    phone={id === 'campaign' ? 'title' : undefined}
                  >
                    {id === 'campaign' ? (
                      row.name
                    ) : id === 'status' ? (
                      <Badge
                        variant={
                          row.status === 'Active' ? 'success' : 'secondary'
                        }
                      >
                        {row.status}
                      </Badge>
                    ) : (
                      row.contacts
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : mode === 'loading' ? (
            <TableLoadingRows columns={4} rows={3} />
          ) : (
            <TableStateRow
              colSpan={4}
              variant={mode}
              title={
                mode === 'error'
                  ? 'Chargement impossible'
                  : mode === 'filtered'
                    ? 'Aucune correspondance'
                    : 'Aucune campagne pour le moment'
              }
              description="État de démonstration uniquement. Aucune requête réseau n’est effectuée."
            />
          )}
        </TableBody>
      </Table>
      {mode === 'data' && (
        <TablePagination
          page={page}
          lastPage={Math.ceil(campaigns.length / pageSize)}
          from={(page - 1) * pageSize + 1}
          to={Math.min(page * pageSize, campaigns.length)}
          total={campaigns.length}
          perPage={pageSize}
          perPageOptions={[3, 6]}
          onPageChange={setPage}
          onPerPageChange={(value) => {
            setPageSize(value);
            setPage(1);
          }}
        />
      )}
    </div>
  );
}

export const dataGroups: CatalogGroup[] = [
  {
    id: 'data',
    title: 'Données et retours',
    description:
      'Exemples avec des données locales déterministes et des états utiles.',
    items: [
      {
        id: 'kanban',
        name: 'Tableau Kanban',
        wide: true,
        description:
          'Colonnes de statut avec compteurs, fiches, priorité, échéances et chargement supplémentaire.',
        preview: (
          <KanbanBoard
            aria-label="Tableau Kanban d’exemple"
            className="min-h-0"
          >
            <KanbanLane
              title="À faire"
              badge={
                <Badge variant="secondary" className="before:hidden">
                  À faire
                </Badge>
              }
              count={2}
            >
              <KanbanCard>
                <KanbanCardTitle>
                  Préparer le brief de campagne pour le lancement de printemps
                </KanbanCardTitle>
                <KanbanCardMeta icon={Building2}>
                  Entreprise d’exemple
                </KanbanCardMeta>
                <KanbanCardFooter>
                  <PriorityIndicator level="high" />
                  <KanbanCardDate overdue>28 oct.</KanbanCardDate>
                </KanbanCardFooter>
              </KanbanCard>
              <KanbanCard>
                <KanbanCardTitle>Examiner la liste d’exemple</KanbanCardTitle>
                <KanbanCardMeta muted>Aucun lien</KanbanCardMeta>
                <KanbanCardFooter>
                  <PriorityIndicator level="low" />
                </KanbanCardFooter>
              </KanbanCard>
            </KanbanLane>
            <KanbanLane
              title="En cours"
              badge={<Badge variant="signal">En cours</Badge>}
              count={0}
              state="empty"
            />
            <KanbanLane
              title="Terminé"
              badge={
                <Badge variant="solid" className="before:hidden">
                  Terminé
                </Badge>
              }
              count={3}
              hasMore
              remaining={2}
              onLoadMore={() => undefined}
            >
              <KanbanCard muted>
                <KanbanCardTitle>Envoyer le contrat d’exemple</KanbanCardTitle>
                <KanbanCardMeta icon={UsersRound}>
                  Contact d’exemple
                </KanbanCardMeta>
                <KanbanCardFooter>
                  <PriorityIndicator level="normal" />
                  <KanbanCardDate>25 oct.</KanbanCardDate>
                </KanbanCardFooter>
              </KanbanCard>
            </KanbanLane>
          </KanbanBoard>
        ),
      },
      {
        id: 'metric-strip',
        name: 'Bandeau d’indicateurs',
        description: 'Une vue d’ensemble compacte de plusieurs indicateurs.',
        preview: (
          <MetricStrip
            items={[
              {
                label: 'Messages',
                value: '1 248',
                detail: '+8 % cette semaine',
                icon: Mail,
              },
              {
                label: 'Contacts',
                value: '354',
                detail: 'Sur 4 listes',
                icon: Users,
              },
              {
                label: 'Réponses',
                value: '82',
                detail: '6,6 % de réponse',
                icon: Activity,
              },
            ]}
          />
        ),
      },
      {
        id: 'progress',
        name: 'Progression',
        description: 'États d’avancement déterminés.',
        preview: (
          <div className="w-full max-w-xs space-y-4">
            <div>
              <span className="text-xs">Préparation des données, 30 %</span>
              <Progress value={30} className="mt-2" />
            </div>
            <div>
              <span className="text-xs">Presque terminé, 80 %</span>
              <Progress value={80} className="mt-2" />
            </div>
          </div>
        ),
      },
      {
        id: 'charts',
        name: 'Graphiques et carte de graphique',
        wide: true,
        description:
          'Graphiques en courbes et en barres adaptatifs partageant les mêmes jetons.',
        preview: (
          <div className="grid w-full gap-3 md:grid-cols-2">
            <ChartCard
              title="Activité"
              description="Messages et réponses par mois"
            >
              <ChartContainer
                config={chartConfig}
                className="h-48 w-full aspect-auto"
              >
                <LineChart data={chartData} accessibilityLayer>
                  <CartesianGrid vertical={false} stroke="var(--line)" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} width={32} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    dataKey="sent"
                    type="monotone"
                    stroke="var(--color-sent)"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    dataKey="replies"
                    type="monotone"
                    stroke="var(--color-replies)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ChartContainer>
            </ChartCard>
            <ChartCard
              title="Volume"
              description="Messages envoyés chaque mois"
            >
              <ChartContainer
                config={chartConfig}
                className="h-48 w-full aspect-auto"
              >
                <BarChart data={chartData} accessibilityLayer>
                  <CartesianGrid vertical={false} stroke="var(--line)" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} width={32} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="sent"
                    fill="var(--color-sent)"
                    radius={[3, 3, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            </ChartCard>
          </div>
        ),
      },
      {
        id: 'table',
        name: 'Tableau, sélection et pagination',
        wide: true,
        description:
          'Tri, sélection, pagination et états de chargement, vide, filtré et d’erreur dans un seul aperçu.',
        preview: <TablePreview />,
      },
      {
        id: 'table-cells',
        name: 'Cellules de tableau',
        description:
          'Cellule d’identité avec initiales, avatar du responsable et pastilles de statut pour les lignes de liste.',
        preview: (
          <div className="flex flex-wrap items-center gap-4">
            <TableIdentity name="Léa Martin" />
            <TableAvatar name="Marie Okafor" />
            <Badge variant="solid" className="before:hidden">
              Client
            </Badge>
            <Badge variant="signal">Actif</Badge>
            <Badge variant="secondary" className="before:hidden">
              Prospect
            </Badge>
            <Badge variant="outline" className="before:hidden">
              Archivé
            </Badge>
          </div>
        ),
      },
    ],
  },
];
