import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@orchestrateur-pharmafield/ui/alert-dialog';
import { Button } from '@orchestrateur-pharmafield/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@orchestrateur-pharmafield/ui/command';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@orchestrateur-pharmafield/ui/context-menu';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@orchestrateur-pharmafield/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@orchestrateur-pharmafield/ui/drawer';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@orchestrateur-pharmafield/ui/dropdown-menu';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@orchestrateur-pharmafield/ui/hover-card';
import { Input } from '@orchestrateur-pharmafield/ui/input';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from '@orchestrateur-pharmafield/ui/menubar';
import { ConfirmModal, FormModal } from '@orchestrateur-pharmafield/ui/modals';
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '@orchestrateur-pharmafield/ui/popover';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@orchestrateur-pharmafield/ui/sheet';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@orchestrateur-pharmafield/ui/tooltip';
import { toast } from 'sonner';
import type { CatalogGroup } from './catalog-types';
import { MultiStepPreview, SettingsPreview } from './overlays-modals';

export const overlayGroups: CatalogGroup[] = [
  {
    id: 'overlays',
    title: 'Superpositions et menus',
    description:
      'Boîtes de dialogue, panneaux, contenus flottants et contrôles contextuels.',
    items: [
      {
        id: 'alert-dialog',
        name: 'Boîte d’alerte',
        description: 'Demandez une confirmation avant une action importante.',
        preview: (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">Ouvrir la boîte d’alerte</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Abandonner les modifications d’exemple ?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Ceci est une démonstration. Rien ne sera abandonné.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Continuer la modification</AlertDialogCancel>
                <AlertDialogAction>Abandonner l’aperçu</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ),
      },
      {
        id: 'dialog',
        name: 'Boîte de dialogue',
        description: 'Un contenu ciblé avec une action de fermeture explicite.',
        preview: (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Ouvrir la boîte de dialogue</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Boîte de dialogue d’exemple</DialogTitle>
                <DialogDescription>
                  Un espace compact pour une tâche ou un message ciblé.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="discrete">
                    Fermer la boîte de dialogue
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ),
      },
      {
        id: 'sheet',
        name: 'Panneau latéral',
        description: 'Un panneau latéral pour du contenu complémentaire.',
        preview: (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">Ouvrir le panneau</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Panneau d’exemple</SheetTitle>
                <SheetDescription>
                  Consultez des détails à côté de la page.
                </SheetDescription>
              </SheetHeader>
              <div className="p-6 text-sm">Ceci est un aperçu local.</div>
              <SheetFooter>
                <SheetClose asChild>
                  <Button variant="discrete">Fermer le panneau</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        ),
      },
      {
        id: 'drawer',
        name: 'Tiroir',
        description: 'Un panneau masquable qui glisse depuis le bas.',
        preview: (
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="outline">Ouvrir le tiroir</Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Tiroir d’exemple</DrawerTitle>
                <DrawerDescription>
                  Des détails supplémentaires sans quitter la page.
                </DrawerDescription>
              </DrawerHeader>
              <DrawerFooter>
                <DrawerClose asChild>
                  <Button variant="discrete">Fermer le tiroir</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        ),
      },
      {
        id: 'popover',
        name: 'Fenêtre contextuelle',
        description: 'Un petit contenu interactif ancré à un déclencheur.',
        preview: (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">Ouvrir la fenêtre contextuelle</Button>
            </PopoverTrigger>
            <PopoverContent>
              <PopoverHeader>
                <PopoverTitle>Détails rapides</PopoverTitle>
                <PopoverDescription>
                  Du contexte sans quitter la vue.
                </PopoverDescription>
              </PopoverHeader>
            </PopoverContent>
          </Popover>
        ),
      },
      {
        id: 'hover-card',
        name: 'Carte au survol',
        description: 'Un aperçu plus riche disponible au survol ou au focus.',
        preview: (
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button variant="outline">Aperçu des détails</Button>
            </HoverCardTrigger>
            <HoverCardContent>
              <strong>Profil d’exemple</strong>
              <p className="mt-1 text-sm">Un court aperçu contextuel.</p>
            </HoverCardContent>
          </HoverCard>
        ),
      },
      {
        id: 'tooltip',
        name: 'Infobulle',
        description: 'Un court texte explicatif au survol ou au focus clavier.',
        preview: (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">Survolez pour une astuce</Button>
              </TooltipTrigger>
              <TooltipContent>Contexte utile pour ce contrôle</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ),
      },
      {
        id: 'dropdown-menu',
        name: 'Menu déroulant',
        description: 'Une liste compacte d’actions rattachée à un bouton.',
        preview: (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Ouvrir les actions</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Actions d’exemple</DropdownMenuLabel>
              <DropdownMenuItem
                onSelect={() => toast.info('Aperçu des détails d’exemple')}
              >
                Voir les détails
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => toast.success('Aperçu de l’action d’exemple')}
              >
                Copier l’exemple
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
      {
        id: 'context-menu',
        name: 'Menu contextuel',
        description:
          'Des actions secondaires accessibles par clic droit ou au clavier.',
        preview: (
          <ContextMenu>
            <ContextMenuTrigger
              className="rounded-[var(--radius-input)] border border-dashed border-[var(--charcoal-a15)] px-4 py-3 text-sm"
              role="button"
              tabIndex={0}
            >
              Faites un clic droit ou appuyez sur Maj+F10
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem
                onSelect={() => toast.info('Aperçu de l’inspection d’exemple')}
              >
                Inspecter l’exemple
              </ContextMenuItem>
              <ContextMenuItem
                onSelect={() => toast.success('Aperçu de l’action d’exemple')}
              >
                Dupliquer l’exemple
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        ),
      },
      {
        id: 'menubar',
        name: 'Barre de menus',
        description: 'Des menus groupés façon application.',
        preview: (
          <Menubar>
            <MenubarMenu>
              <MenubarTrigger>Fichier</MenubarTrigger>
              <MenubarContent>
                <MenubarItem
                  onSelect={() => toast.info('Aperçu du nouvel exemple')}
                >
                  Nouvel exemple
                </MenubarItem>
                <MenubarItem
                  onSelect={() => toast.info('Aperçu de l’ouverture d’exemple')}
                >
                  Ouvrir un exemple
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger>Affichage</MenubarTrigger>
              <MenubarContent>
                <MenubarItem
                  onSelect={() => toast.info('Aperçu des détails d’exemple')}
                >
                  Afficher les détails
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        ),
      },
      {
        id: 'command',
        name: 'Palette de commandes',
        description: 'Une liste de commandes consultable, pratique au clavier.',
        preview: (
          <Command className="max-w-sm border border-[var(--line)]">
            <CommandInput
              aria-label="Rechercher des commandes d’exemple"
              placeholder="Rechercher des commandes…"
            />
            <CommandList>
              <CommandEmpty>Aucune commande correspondante.</CommandEmpty>
              <CommandGroup heading="Exemples">
                <CommandItem
                  value="view sample"
                  onSelect={() => toast.info('Aperçu de l’exemple')}
                >
                  Voir l’exemple
                </CommandItem>
                <CommandItem
                  value="edit sample"
                  onSelect={() => toast.info('Aperçu de la modification')}
                >
                  Modifier l’exemple
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        ),
      },
      {
        id: 'sonner',
        name: 'Notifications (Sonner)',
        description:
          'Affichez des messages temporaires de succès, d’information et d’erreur.',
        preview: (
          <>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={() => toast.success('Exemple enregistré localement')}
              >
                Notification de succès
              </Button>
              <Button
                variant="outline"
                onClick={() => toast.info('Ceci est un aperçu')}
              >
                Notification d’information
              </Button>
              <Button
                variant="outline"
                onClick={() => toast.error('Message d’erreur d’exemple')}
              >
                Notification d’erreur
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  toast.warning('Avertissement d’exemple', {
                    description: 'Un élément requiert votre attention.',
                  })
                }
              >
                Notification d’avertissement
              </Button>
              <Button
                variant="outline"
                onClick={() => toast.loading('Traitement d’exemple en cours')}
              >
                Notification de chargement
              </Button>
            </div>
          </>
        ),
      },
    ],
  },
  {
    id: 'modals',
    title: 'Fenêtres modales dédiées',
    description:
      'Mises en page prêtes à l’emploi pour la confirmation, les formulaires, les étapes et les paramètres.',
    items: [
      {
        id: 'confirm-modal',
        name: 'ConfirmModal',
        description:
          'Une confirmation avec une action dédiée et un contrôle d’annulation, ainsi qu’un choix secondaire facultatif.',
        preview: (
          <div className="flex flex-wrap gap-2">
            <ConfirmModal
              trigger={
                <Button variant="outline">Ouvrir la confirmation</Button>
              }
              title="Confirmer l’action d’exemple"
              description="Cette démonstration ne modifie aucune donnée."
              confirmLabel="Confirmer l’aperçu"
              onConfirm={() => {
                toast.success('Action d’exemple confirmée');
              }}
            />
            <ConfirmModal
              trigger={
                <Button variant="outline">Avec un choix secondaire</Button>
              }
              title="Renvoyer cet exemple ?"
              description="Le choix sûr est principal ; le choix risqué est secondaire."
              confirmLabel="Choix sûr"
              secondaryAction={{
                label: 'Choix risqué',
                onAction: () => {
                  toast.info('Choix secondaire sélectionné');
                },
              }}
              onConfirm={() => {
                toast.success('Choix sûr sélectionné');
              }}
            />
          </div>
        ),
      },
      {
        id: 'form-modal',
        name: 'FormModal',
        description:
          'Une mise en page de formulaire avec un pied d’envoi facultatif.',
        preview: (
          <FormModal
            trigger={
              <Button variant="outline">Ouvrir la fenêtre de formulaire</Button>
            }
            title="Formulaire d’exemple"
            description="Essayez le champ. L’envoi reste local à cet aperçu."
            submitLabel="Essayer l’envoi"
            onSubmit={(event) => {
              event.preventDefault();
              toast.success('Formulaire d’exemple envoyé');
            }}
          >
            <label
              htmlFor="catalog-overlay-sample-name"
              className="text-sm font-medium"
            >
              Nom d’exemple
            </label>
            <Input
              id="catalog-overlay-sample-name"
              placeholder="Saisissez un nom"
            />
          </FormModal>
        ),
      },
      {
        id: 'multi-step-modal',
        name: 'MultiStepModal',
        description:
          'Un parcours guidé avec navigation locale entre les étapes.',
        preview: <MultiStepPreview />,
      },
      {
        id: 'settings-modal',
        name: 'SettingsModal',
        description:
          'Une mise en page de paramètres à onglets avec un déclencheur contrôlé.',
        preview: <SettingsPreview />,
      },
    ],
  },
];
