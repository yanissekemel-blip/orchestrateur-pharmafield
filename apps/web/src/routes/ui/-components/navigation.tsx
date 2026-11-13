import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@orchestrateur-pharmafield/ui/accordion';
import { Badge } from '@orchestrateur-pharmafield/ui/badge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@orchestrateur-pharmafield/ui/breadcrumb';
import { Button } from '@orchestrateur-pharmafield/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@orchestrateur-pharmafield/ui/carousel';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@orchestrateur-pharmafield/ui/collapsible';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@orchestrateur-pharmafield/ui/empty';
import { FilterBar } from '@orchestrateur-pharmafield/ui/filter-bar';
import { Input } from '@orchestrateur-pharmafield/ui/input';
import {
  PageFooter,
  PageHeader,
} from '@orchestrateur-pharmafield/ui/page-header';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@orchestrateur-pharmafield/ui/pagination';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@orchestrateur-pharmafield/ui/resizable';
import { ScrollArea } from '@orchestrateur-pharmafield/ui/scroll-area';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from '@orchestrateur-pharmafield/ui/sidebar';
import { Skeleton } from '@orchestrateur-pharmafield/ui/skeleton';
import { Spinner } from '@orchestrateur-pharmafield/ui/spinner';
import { TableColumnPicker } from '@orchestrateur-pharmafield/ui/table-column-picker';
import {
  type TableFilterGroups,
  TableFilterSheet,
} from '@orchestrateur-pharmafield/ui/table-filter-sheet';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@orchestrateur-pharmafield/ui/tabs';
import { Layers3, Mail, PanelLeft, Search } from 'lucide-react';
import { useState } from 'react';
import type { CatalogGroup } from './catalog-types';

function PaginationPreview() {
  const [page, setPage] = useState(1);
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#pagination"
            onClick={(event) => {
              event.preventDefault();
              setPage(Math.max(1, page - 1));
            }}
          />
        </PaginationItem>
        {[1, 2, 3].map((number) => (
          <PaginationItem key={number}>
            <PaginationLink
              href="#pagination"
              isActive={page === number}
              onClick={(event) => {
                event.preventDefault();
                setPage(number);
              }}
            >
              {number}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            href="#pagination"
            onClick={(event) => {
              event.preventDefault();
              setPage(Math.min(3, page + 1));
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

function TableColumnPickerPreview() {
  const [visible, setVisible] = useState(['name', 'email', 'status']);
  const [order, setOrder] = useState(['name', 'email', 'status']);
  return (
    <TableColumnPicker
      columns={[
        { id: 'name', label: 'Nom' },
        { id: 'email', label: 'E-mail' },
        { id: 'status', label: 'Statut' },
      ]}
      visible={visible}
      order={order}
      requiredIds={['name']}
      onVisibleChange={setVisible}
      onOrderChange={setOrder}
    />
  );
}

function TableFilterSheetPreview() {
  const [value, setValue] = useState<TableFilterGroups | null>(null);
  return (
    <TableFilterSheet
      fields={[
        { id: 'name', label: 'Nom', kind: 'text' },
        {
          id: 'status',
          label: 'Statut',
          kind: 'choice',
          options: [
            { value: 'active', label: 'Actif' },
            { value: 'archived', label: 'Archivé' },
          ],
        },
        { id: 'createdAt', label: 'Créé le', kind: 'instant' },
      ]}
      value={value}
      onChange={setValue}
    />
  );
}

function SidebarPreview() {
  return (
    <SidebarProvider
      className="h-52 min-h-0 overflow-hidden rounded-[var(--radius-card)] border border-[var(--line)]"
      defaultOpen
    >
      <Sidebar collapsible="none">
        <SidebarHeader className="px-4 py-3 text-sm font-extrabold">
          Espace de travail
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Layers3 aria-hidden="true" /> Vue d’ensemble
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Mail aria-hidden="true" /> Messages
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <div className="flex flex-1 items-center justify-center gap-2 bg-pharmafield-panel-2 text-xs text-muted-foreground">
        <PanelLeft className="size-4" aria-hidden="true" /> Zone de contenu
      </div>
    </SidebarProvider>
  );
}

export const navigationGroups: CatalogGroup[] = [
  {
    id: 'navigation',
    title: 'Navigation et mise en page',
    description: 'Structure de page, découverte et affichage progressif.',
    items: [
      {
        id: 'breadcrumb',
        name: 'Fil d’Ariane',
        description: 'Un chemin de navigation compact.',
        preview: (
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#breadcrumb">
                  Espace de travail
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Campagnes</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        ),
      },
      {
        id: 'page-header',
        name: 'En-tête de page et barre de filtres',
        description:
          'Une composition réutilisable d’en-tête, de barre de filtres et de pied de page.',
        preview: (
          <div className="w-full overflow-hidden rounded-[var(--radius-card)] border border-[var(--line)]">
            <PageHeader
              title="Campagnes"
              count={124}
              actions={<Button size="sm">Créer</Button>}
              stats={[{ label: 'Actives', value: '12', accent: 'success' }]}
            />
            <FilterBar
              left={
                <Input
                  aria-label="Rechercher des campagnes"
                  placeholder="Rechercher des campagnes…"
                  className="max-w-56"
                />
              }
              right={<Badge variant="outline">Démo</Badge>}
            />
            <PageFooter>Espace de travail d’exemple</PageFooter>
          </div>
        ),
      },
      {
        id: 'table-filter-sheet',
        name: 'Filtres de tableau',
        description:
          'Composez des groupes de filtres ET et OU dans un panneau latéral.',
        preview: <TableFilterSheetPreview />,
      },
      {
        id: 'table-column-picker',
        name: 'Sélecteur de colonnes',
        description: 'Choisissez les colonnes visibles du tableau de données.',
        preview: <TableColumnPickerPreview />,
      },
      {
        id: 'sidebar',
        name: 'Barre latérale',
        description: 'Un aperçu autonome de la navigation de l’application.',
        preview: <SidebarPreview />,
      },
      {
        id: 'pagination',
        name: 'Pagination',
        description: 'Changez la page active sans quitter la vue.',
        preview: <PaginationPreview />,
      },
      {
        id: 'tabs',
        name: 'Onglets',
        description: 'Basculez entre deux panneaux de contenu locaux.',
        preview: (
          <Tabs defaultValue="activity" className="w-full">
            <TabsList>
              <TabsTrigger value="activity">Activité</TabsTrigger>
              <TabsTrigger value="details">Détails</TabsTrigger>
            </TabsList>
            <TabsContent value="activity" className="pt-3 text-sm">
              L’activité récente s’affiche ici.
            </TabsContent>
            <TabsContent value="details" className="pt-3 text-sm">
              Les détails supplémentaires s’affichent ici.
            </TabsContent>
          </Tabs>
        ),
      },
      {
        id: 'accordion',
        name: 'Accordéon',
        description: 'Dépliez une question sans changer de page.',
        preview: (
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="one">
              <AccordionTrigger>
                Comment cela fonctionne-t-il ?
              </AccordionTrigger>
              <AccordionContent>
                Ouvrez un panneau pour afficher plus d’informations.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="two">
              <AccordionTrigger>Puis-je le refermer ?</AccordionTrigger>
              <AccordionContent>
                Oui, sélectionnez à nouveau le même intitulé.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ),
      },
      {
        id: 'collapsible',
        name: 'Zone repliable',
        description: 'Une simple zone de détails dépliable.',
        preview: (
          <Collapsible className="w-full">
            <CollapsibleTrigger asChild>
              <Button variant="outline">Afficher les détails</Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-3 text-sm">
              Les détails supplémentaires sont affichés ici.
            </CollapsibleContent>
          </Collapsible>
        ),
      },
      {
        id: 'carousel',
        name: 'Carrousel',
        description: 'Naviguez entre des diapositives d’exemple.',
        preview: (
          <Carousel className="mx-10 w-48">
            <CarouselContent>
              {[1, 2, 3].map((value) => (
                <CarouselItem key={value}>
                  <div className="grid h-24 place-items-center rounded-[var(--radius-card)] bg-pharmafield-panel-2 text-lg">
                    Diapositive {value}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        ),
      },
      {
        id: 'resizable',
        name: 'Panneaux redimensionnables',
        description:
          'Faites glisser le séparateur pour répartir l’espace disponible.',
        preview: (
          <ResizablePanelGroup
            orientation="horizontal"
            className="h-28 w-full rounded-[var(--radius-card)] border border-[var(--line)]"
          >
            <ResizablePanel
              defaultSize={50}
              className="grid place-items-center text-sm"
            >
              Gauche
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel
              defaultSize={50}
              className="grid place-items-center text-sm"
            >
              Droite
            </ResizablePanel>
          </ResizablePanelGroup>
        ),
      },
      {
        id: 'scroll-area',
        name: 'Zone de défilement',
        description: 'Une liste compacte, accessible au clavier.',
        preview: (
          <ScrollArea className="h-32 w-64 rounded-[var(--radius-input)] border border-[var(--line)] p-3">
            {[
              'Vue d’ensemble',
              'Campagnes',
              'Prospects',
              'Boîte de réception',
              'Tâches',
              'Paramètres',
              'Rapports',
            ].map((label) => (
              <div
                key={label}
                className="border-b border-[var(--line-2)] py-2 text-xs last:border-0"
              >
                {label}
              </div>
            ))}
          </ScrollArea>
        ),
      },
      {
        id: 'empty',
        name: 'État vide',
        description: 'Des indications pour une vue sans enregistrement.',
        preview: (
          <Empty className="w-full border border-dashed py-6">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Search aria-hidden="true" />
              </EmptyMedia>
              <EmptyTitle>Aucun résultat</EmptyTitle>
              <EmptyDescription>
                Essayez un autre terme de recherche.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ),
      },
      {
        id: 'skeleton',
        name: 'Squelette',
        description:
          'Espaces réservés de chargement dimensionnés comme le contenu final.',
        preview: (
          <div className="w-full max-w-xs space-y-3">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-10 w-40" />
          </div>
        ),
      },
      {
        id: 'spinner',
        name: 'Indicateur de chargement',
        description: 'Un indicateur de progression compact.',
        preview: (
          <div className="flex items-center gap-4">
            <Spinner />
            <Spinner className="size-6" />
            <span className="text-xs text-muted-foreground">Chargement</span>
          </div>
        ),
      },
    ],
  },
];
