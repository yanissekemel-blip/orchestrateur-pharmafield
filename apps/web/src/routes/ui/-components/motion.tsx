import { Button } from '@orchestrateur-pharmafield/ui/button';
import { Checkbox } from '@orchestrateur-pharmafield/ui/checkbox';
import { Panel } from '@orchestrateur-pharmafield/ui/panel';
import { Presence } from '@orchestrateur-pharmafield/ui/presence';
import { SegmentedControl } from '@orchestrateur-pharmafield/ui/segmented-control';
import { Skeleton } from '@orchestrateur-pharmafield/ui/skeleton';
import { Switch } from '@orchestrateur-pharmafield/ui/switch';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@orchestrateur-pharmafield/ui/tabs';
import {
  ArrowRight,
  Download,
  LayoutGrid,
  List,
  Plus,
  RefreshCw,
  Rows3,
} from 'lucide-react';
import { useState } from 'react';
import type { CatalogGroup } from './catalog-types';

const tokens = [
  ['--motion-instant', '90ms', 'Retour à l’appui'],
  ['--motion-fast', '140ms', 'Couleur au survol, sorties'],
  ['--motion-base', '200ms', 'Fondus, anneaux de focus'],
  ['--motion-page', '260ms', 'Transitions de page'],
  ['--motion-slow', '320ms', 'Apparition du contenu'],
  [
    '--motion-spring',
    '420ms',
    'Ressorts : pastilles, boîtes de dialogue, coches',
  ],
] as const;

function ButtonsPreview() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button>
        <Plus aria-hidden="true" />
        Créer un contact
      </Button>
      <Button variant="header">
        <Download aria-hidden="true" />
        Exporter
      </Button>
      <Button variant="secondary">
        Continuer
        <ArrowRight aria-hidden="true" />
      </Button>
      <Button variant="outline" size="icon" aria-label="Actualiser">
        <RefreshCw aria-hidden="true" />
      </Button>
    </div>
  );
}

function SwitchingPreview() {
  const [view, setView] = useState<'list' | 'board' | 'grid'>('list');
  return (
    <div className="grid w-full max-w-md gap-4">
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Vue d’ensemble</TabsTrigger>
          <TabsTrigger value="activity">Activité</TabsTrigger>
          <TabsTrigger value="deals">Affaires</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="text-[12.5px]">
          La pastille active glisse vers le nouvel onglet et le contenu
          apparaît.
        </TabsContent>
        <TabsContent value="activity" className="text-[12.5px]">
          Appels, e-mails et notes récents.
        </TabsContent>
        <TabsContent value="deals" className="text-[12.5px]">
          Opportunités ouvertes avec cette entreprise.
        </TabsContent>
      </Tabs>
      <SegmentedControl
        aria-label="Disposition"
        value={view}
        onValueChange={setView}
        items={[
          { value: 'list', label: 'Liste', icon: List },
          { value: 'board', label: 'Tableau', icon: Rows3 },
          { value: 'grid', label: 'Grille', icon: LayoutGrid },
        ]}
      />
    </div>
  );
}

function ChecksPreview() {
  const [on, setOn] = useState(true);
  const [checked, setChecked] = useState(true);
  return (
    <div className="flex flex-wrap items-center gap-6 text-[12.5px]">
      <span className="flex items-center gap-2">
        <Switch
          checked={on}
          onCheckedChange={setOn}
          aria-label="Notifications"
        />
        Notifications
      </span>
      <span className="flex items-center gap-2">
        <Checkbox
          checked={checked}
          onCheckedChange={(value) => setChecked(value === true)}
          aria-label="À relancer"
        />
        À relancer
      </span>
    </div>
  );
}

function PresencePreview() {
  const [show, setShow] = useState(false);
  return (
    <div className="grid w-full max-w-md gap-3">
      <Button
        variant="header"
        className="w-fit"
        onClick={() => setShow((value) => !value)}
      >
        {show ? 'Masquer les détails' : 'Afficher les détails'}
      </Button>
      <Presence show={show}>
        <Panel variant="card" padding="sm" className="text-[12.5px]">
          Presence ouvre le contenu avec un ressort et le garde monté jusqu’à la
          fin de sa fermeture.
        </Panel>
      </Presence>
    </div>
  );
}

function LoadingPreview() {
  return (
    <div className="grid w-full max-w-md gap-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
}

export const motionGroups: CatalogGroup[] = [
  {
    id: 'motion',
    title: 'Animations',
    description:
      'Jetons d’animation partagés et comportement hérité par chaque composant.',
    items: [
      {
        id: 'motion-tokens',
        name: 'Jetons d’animation',
        description:
          'Durées et courbes d’accélération définies dans globals.css.',
        preview: (
          <dl className="grid w-full max-w-md gap-1.5 text-[12.5px]">
            {tokens.map(([name, value, use]) => (
              <div key={name} className="flex items-baseline gap-3">
                <dt className="w-36 shrink-0 font-mono text-[11.5px]">
                  {name}
                </dt>
                <dd className="w-14 shrink-0 font-bold">{value}</dd>
                <dd className="text-[var(--ink-2)]">{use}</dd>
              </div>
            ))}
          </dl>
        ),
      },
      {
        id: 'motion-buttons',
        name: 'Survol et appui des boutons',
        description:
          'Les boutons s’élèvent au survol, rebondissent après un appui et décalent légèrement leur icône.',
        preview: <ButtonsPreview />,
      },
      {
        id: 'motion-switching',
        name: 'Sélection glissante',
        description:
          'Les onglets, contrôles segmentés, le rail et les paramètres font glisser une pastille active.',
        preview: <SwitchingPreview />,
      },
      {
        id: 'motion-checks',
        name: 'Interrupteurs et coches',
        description: 'Curseurs et coches se stabilisent avec un ressort.',
        preview: <ChecksPreview />,
      },
      {
        id: 'motion-presence',
        name: 'Presence',
        description:
          'Montage et démontage animés pour le contenu conditionnel.',
        preview: <PresencePreview />,
      },
      {
        id: 'motion-loading',
        name: 'Chargement',
        description:
          'Les squelettes scintillent ; les données chargées les remplacent sur place sans seconde entrée.',
        preview: <LoadingPreview />,
      },
    ],
  },
];
