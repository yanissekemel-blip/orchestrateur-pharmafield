import { Badge } from '@orchestrateur-pharmafield/ui/badge';
import { Button } from '@orchestrateur-pharmafield/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@orchestrateur-pharmafield/ui/dropdown-menu';
import { ConfirmModal } from '@orchestrateur-pharmafield/ui/modals/confirm-modal';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@orchestrateur-pharmafield/ui/table';
import {
  Copy,
  MoreHorizontal,
  Pencil,
  ShieldUser,
  Trash2,
  UserRound,
} from 'lucide-react';
import type { CatalogGroup } from './catalog-types';

const agents = [
  { name: 'Camille Lefèvre', role: 'Chef de poste', status: 'En service' },
  { name: 'Mathis Bernard', role: 'Agent', status: 'En repos' },
  {
    name: 'Inès Moreau-Delacroix',
    role: 'Agent cynophile',
    status: 'En service',
  },
];

function PhoneCardsPreview() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead icon={UserRound}>Nom</TableHead>
          <TableHead icon={ShieldUser}>Fonction</TableHead>
          <TableHead>Statut</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {agents.map((agent) => (
          <TableRow key={agent.name}>
            <TableCell phone="title">{agent.name}</TableCell>
            <TableCell label="Fonction">{agent.role}</TableCell>
            <TableCell label="Statut">
              <Badge
                variant={agent.status === 'En service' ? 'signal' : 'secondary'}
              >
                {agent.status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function PhoneSheetsPreview() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" aria-label="Actions">
            <MoreHorizontal aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem>
            <Pencil aria-hidden="true" />
            Modifier
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Copy aria-hidden="true" />
            Dupliquer
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">
            <Trash2 aria-hidden="true" />
            Supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmModal
        trigger={<Button variant="header">Ouvrir une confirmation</Button>}
        title="Archiver ce rapport ?"
        description="Il restera consultable dans les archives."
        confirmLabel="Archiver"
        onConfirm={() => undefined}
      />
    </div>
  );
}

export const phoneGroups: CatalogGroup[] = [
  {
    id: 'phone',
    title: 'Téléphone',
    description:
      'Sous 640 px, les composants partagés s’adaptent seuls : réduisez la fenêtre pour voir la version téléphone.',
    items: [
      {
        id: 'phone-table-cards',
        name: 'Tableau en cartes',
        description:
          'Chaque ligne devient une carte. La cellule `phone="title"` ouvre la carte ; les autres affichent leur `label`.',
        preview: <PhoneCardsPreview />,
        wide: true,
      },
      {
        id: 'phone-sheets',
        name: 'Feuilles du bas',
        description:
          'Menus, popovers, modales et panneaux latéraux s’ouvrent depuis le bas de l’écran.',
        preview: <PhoneSheetsPreview />,
      },
    ],
  },
];
