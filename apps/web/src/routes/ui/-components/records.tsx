import {
  ColorInput,
  ColorSwatch,
} from '@orchestrateur-pharmafield/ui/color-input';
import {
  DetailsItem,
  DetailsList,
} from '@orchestrateur-pharmafield/ui/details-list';
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@orchestrateur-pharmafield/ui/dropdown-menu';
import {
  StatusMenu,
  type StatusMenuOption,
} from '@orchestrateur-pharmafield/ui/status-menu';
import { TableRowMenu } from '@orchestrateur-pharmafield/ui/table-row-menu';
import { Eye, Mail, MapPin, NotebookText, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { CatalogGroup } from './catalog-types';

type Status = 'active' | 'inactive';
const statuses: readonly StatusMenuOption<Status>[] = [
  { value: 'active', label: 'Actif', variant: 'success' },
  { value: 'inactive', label: 'Inactif', variant: 'outline' },
];

function StatusMenuPreview() {
  const [status, setStatus] = useState<Status>('active');
  return (
    <div className="flex flex-wrap items-center gap-4">
      <StatusMenu value={status} options={statuses} onChange={setStatus} />
      <span className="flex items-center gap-2 text-xs text-muted-foreground">
        Lecture seule
        <StatusMenu value={status} options={statuses} />
      </span>
    </div>
  );
}

function ColorInputPreview() {
  const [color, setColor] = useState('#213F75');
  return (
    <div className="grid w-full max-w-56 gap-3">
      <ColorInput
        value={color}
        onChange={setColor}
        aria-label="Couleur d’exemple"
      />
      <span className="flex items-center gap-2 text-xs text-muted-foreground">
        <ColorSwatch color={color} />
        Pastille seule, pour une liste
      </span>
    </div>
  );
}

function RowMenuPreview() {
  const [last, setLast] = useState('Aucune action');
  return (
    <div className="flex items-center gap-3">
      <TableRowMenu label="Actions pour l’exemple" align="start">
        <DropdownMenuItem onSelect={() => setLast('Voir')}>
          <Eye aria-hidden="true" />
          Voir la fiche
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => setLast('Modifier')}>
          <Pencil aria-hidden="true" />
          Modifier
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onSelect={() => setLast('Supprimer')}
        >
          <Trash2 aria-hidden="true" />
          Supprimer
        </DropdownMenuItem>
      </TableRowMenu>
      <span className="text-xs text-muted-foreground">{last}</span>
    </div>
  );
}

export const recordGroups: CatalogGroup[] = [
  {
    id: 'records',
    title: 'Fiches et actions',
    description:
      'Les éléments d’une fiche : ses faits, son statut modifiable, son menu d’actions.',
    items: [
      {
        id: 'details-list',
        name: 'DetailsList',
        description:
          'Paires libellé/valeur d’une fiche ; une valeur absente affiche un tiret.',
        preview: (
          <DetailsList className="w-full">
            <DetailsItem label="E-mail" icon={Mail}>
              camille.durand-lefebvre@atelier-signaletique.example
            </DetailsItem>
            <DetailsItem label="Adresse" icon={MapPin}>
              {'12 rue des Lilas\n69003 Lyon'}
            </DetailsItem>
            <DetailsItem label="Notes" icon={NotebookText} />
          </DetailsList>
        ),
      },
      {
        id: 'status-menu',
        name: 'StatusMenu',
        description:
          'Pastille de statut qui ouvre un menu et enregistre à la sélection ; simple pastille en lecture seule.',
        preview: <StatusMenuPreview />,
      },
      {
        id: 'table-row-menu',
        name: 'TableRowMenu',
        description:
          'Menu « … » des actions d’un enregistrement ; les actions destructives en dernier.',
        preview: <RowMenuPreview />,
      },
      {
        id: 'color-input',
        name: 'ColorInput',
        description:
          'Champ couleur #RRGGBB : la pastille ouvre le sélecteur du système, la valeur se saisit ou se colle.',
        preview: <ColorInputPreview />,
      },
    ],
  },
];
