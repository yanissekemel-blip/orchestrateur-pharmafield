import { AspectRatio } from '@orchestrateur-pharmafield/ui/aspect-ratio';
import { Avatar, AvatarFallback } from '@orchestrateur-pharmafield/ui/avatar';
import { Badge } from '@orchestrateur-pharmafield/ui/badge';
import { Button } from '@orchestrateur-pharmafield/ui/button';
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from '@orchestrateur-pharmafield/ui/button-group';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@orchestrateur-pharmafield/ui/card';
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@orchestrateur-pharmafield/ui/item';
import { Kbd } from '@orchestrateur-pharmafield/ui/kbd';
import { Panel } from '@orchestrateur-pharmafield/ui/panel';
import { Separator } from '@orchestrateur-pharmafield/ui/separator';
import {
  RolePill,
  StatusPill,
} from '@orchestrateur-pharmafield/ui/status-pill';
import { Mail, Sparkles } from 'lucide-react';
import type { CatalogGroup } from './catalog-types';

const swatches = [
  ['Fond', 'var(--bg)'],
  ['Panneau', 'var(--panel)'],
  ['Sarcelle de marque', 'var(--brand-teal)'],
  ['Anthracite de marque', 'var(--brand-ink)'],
  ['Sarcelle lisible', 'var(--teal-700)'],
  ['Encre', 'var(--ink)'],
  ['Succès', 'var(--ok)'],
  ['Danger', 'var(--bad)'],
] as const;

export const foundationGroups: CatalogGroup[] = [
  {
    id: 'foundations',
    title: 'Fondations',
    description: 'Jetons, surfaces et petits éléments de base.',
    items: [
      {
        id: 'theme',
        name: 'Jetons du thème',
        description:
          'La palette globale et la typographie réellement utilisées par l’application.',
        preview: (
          <div className="w-full space-y-5">
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
              {swatches.map(([name, color]) => (
                <div key={name}>
                  <div
                    className="h-11 rounded-md border"
                    style={{ background: color }}
                  />
                  <span className="mt-1 block text-xs text-muted-foreground">
                    {name}
                  </span>
                </div>
              ))}
            </div>
            <div>
              <p className="font-display text-xl">
                Poppins demi-gras, pour les titres
              </p>
              <p className="text-sm">Montserrat, pour des interfaces claires</p>
              <p className="font-label text-[10.5px] text-muted-foreground">
                Montserrat demi-gras, pour les libellés
              </p>
              <p className="font-mono text-xs text-muted-foreground">
                JetBrains Mono, pour les valeurs et le code
              </p>
            </div>
          </div>
        ),
      },
      {
        id: 'button',
        name: 'Bouton',
        description: 'Variantes, tailles et état désactivé.',
        preview: (
          <div className="flex flex-wrap items-center gap-2">
            <Button>Principal</Button>
            <Button variant="secondary">Secondaire</Button>
            <Button variant="outline">Contour</Button>
            <Button variant="discrete">Discret</Button>
            <Button variant="ghost">Fantôme</Button>
            <Button variant="destructive">Destructif</Button>
            <Button size="sm">Petit</Button>
            <Button disabled>Désactivé</Button>
          </div>
        ),
      },
      {
        id: 'button-group',
        name: 'Groupe de boutons',
        description:
          'Des actions adjacentes partagent un même traitement groupé.',
        preview: (
          <ButtonGroup>
            <Button variant="outline">Jour</Button>
            <ButtonGroupSeparator />
            <Button variant="outline">Semaine</Button>
            <ButtonGroupSeparator />
            <Button variant="outline">Mois</Button>
          </ButtonGroup>
        ),
      },
      {
        id: 'badge',
        name: 'Badge',
        description:
          'Indicateurs compacts pour les catégories et les résultats.',
        preview: (
          <div className="flex flex-wrap gap-2">
            <Badge>Par défaut</Badge>
            <Badge variant="signal">Signal</Badge>
            <Badge variant="secondary">Secondaire</Badge>
            <Badge variant="success">Succès</Badge>
            <Badge variant="warning">Avertissement</Badge>
            <Badge variant="destructive">Danger</Badge>
            <Badge variant="outline">Contour</Badge>
          </div>
        ),
      },
      {
        id: 'status-pill',
        name: 'Pastilles de statut et de rôle',
        description: 'Variantes sémantiques de statut et de rôle.',
        preview: (
          <div className="flex flex-wrap gap-2">
            <StatusPill tone="active">Actif</StatusPill>
            <StatusPill tone="pending">En attente</StatusPill>
            <StatusPill tone="danger">Échec</StatusPill>
            <RolePill tone="admin">Administrateur</RolePill>
            <RolePill tone="sage">Membre</RolePill>
          </div>
        ),
      },
      {
        id: 'avatar',
        name: 'Avatar',
        description: 'Initiales de repli lorsqu’aucune image n’est disponible.',
        preview: (
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>AB</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>CD</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>EF</AvatarFallback>
            </Avatar>
          </div>
        ),
      },
      {
        id: 'card',
        name: 'Carte',
        description:
          'Une surface composée d’un en-tête, d’un corps et d’un pied.',
        preview: (
          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle>Campagne</CardTitle>
              <CardDescription>Contenu d’exemple</CardDescription>
            </CardHeader>
            <CardContent>
              1 248 contacts sont prêts à être examinés.
            </CardContent>
            <CardFooter>
              <Button size="sm">Examiner</Button>
            </CardFooter>
          </Card>
        ),
      },
      {
        id: 'panel',
        name: 'Panneau',
        description:
          'Surface d’application flexible avec une élévation partagée.',
        preview: (
          <Panel className="w-full">
            <p className="font-semibold">Titre du panneau</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Une surface réutilisable pour le contenu du tableau de bord.
            </p>
          </Panel>
        ),
      },
      {
        id: 'aspect-ratio',
        name: 'Format d’image',
        description: 'Un cadre média qui conserve ses proportions.',
        preview: (
          <AspectRatio
            ratio={16 / 9}
            className="grid w-64 place-items-center rounded-md bg-pharmafield-panel-2 text-muted-foreground"
          >
            <Sparkles aria-hidden="true" /> Aperçu 16:9
          </AspectRatio>
        ),
      },
      {
        id: 'item',
        name: 'Élément',
        description: 'Lignes de liste structurées avec média et descriptions.',
        preview: (
          <ItemGroup className="w-full max-w-sm">
            <li>
              <Item variant="outline">
                <ItemMedia variant="icon">
                  <Mail aria-hidden="true" />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>Boîte de réception</ItemTitle>
                  <ItemDescription>12 nouvelles conversations</ItemDescription>
                </ItemContent>
              </Item>
            </li>
          </ItemGroup>
        ),
      },
      {
        id: 'separator',
        name: 'Séparateur',
        description: 'Séparation discrète entre des contenus liés.',
        preview: (
          <div className="w-full max-w-xs text-sm">
            Avant
            <Separator className="my-3" />
            Après
          </div>
        ),
      },
      {
        id: 'kbd',
        name: 'Indication clavier',
        description:
          'Les raccourcis sont présentés sans reposer uniquement sur des icônes.',
        preview: (
          <div className="flex items-center gap-2 text-sm">
            Rechercher <Kbd>Ctrl</Kbd>
            <span>+</span>
            <Kbd>K</Kbd>
          </div>
        ),
      },
    ],
  },
];
