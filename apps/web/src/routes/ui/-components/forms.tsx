import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@orchestrateur-pharmafield/ui/button';
import { Checkbox } from '@orchestrateur-pharmafield/ui/checkbox';
import { Combobox } from '@orchestrateur-pharmafield/ui/combobox';
import { DebouncedSearchInput } from '@orchestrateur-pharmafield/ui/debounced-search-input';
import {
  Field,
  FieldDescription,
  FieldLabel,
} from '@orchestrateur-pharmafield/ui/field';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@orchestrateur-pharmafield/ui/form';
import { Input } from '@orchestrateur-pharmafield/ui/input';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from '@orchestrateur-pharmafield/ui/input-group';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@orchestrateur-pharmafield/ui/input-otp';
import { Label } from '@orchestrateur-pharmafield/ui/label';
import {
  RadioGroup,
  RadioGroupCard,
  RadioGroupItem,
} from '@orchestrateur-pharmafield/ui/radio-group';
import { RichTextEditor } from '@orchestrateur-pharmafield/ui/rich-text-editor';
import { SegmentedControl } from '@orchestrateur-pharmafield/ui/segmented-control';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@orchestrateur-pharmafield/ui/select';
import { Slider } from '@orchestrateur-pharmafield/ui/slider';
import { Switch } from '@orchestrateur-pharmafield/ui/switch';
import { Textarea } from '@orchestrateur-pharmafield/ui/textarea';
import { TimezoneCombobox } from '@orchestrateur-pharmafield/ui/timezone-combobox';
import { Toggle } from '@orchestrateur-pharmafield/ui/toggle';
import {
  ToggleGroup,
  ToggleGroupItem,
} from '@orchestrateur-pharmafield/ui/toggle-group';
import { useId, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import type { CatalogGroup } from './catalog-types';
import {
  CalendarPreview,
  DatePickerPreview,
  DateTimePickerPreview,
  RangeCalendarPreview,
} from './forms-dates';

const formSchema = z.object({
  name: z.string().trim().min(2, 'Saisissez au moins deux caractères.'),
  role: z.enum(['user', 'super_admin'], 'Choisissez un rôle.'),
});
type FormValues = z.infer<typeof formSchema>;

function FormPreview() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', role: 'user' },
  });
  const [saved, setSaved] = useState(false);
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(() => setSaved(true))}
        className="grid w-full max-w-sm gap-4"
        noValidate
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom affiché</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ada Lovelace"
                  {...field}
                  onChange={(event) => {
                    setSaved(false);
                    field.onChange(event);
                  }}
                />
              </FormControl>
              <FormDescription>
                Saisissez un nom à valider localement.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rôle</FormLabel>
              <Select
                value={field.value}
                onValueChange={(value) => {
                  setSaved(false);
                  field.onChange(value);
                }}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choisissez un rôle" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="user">Utilisateur</SelectItem>
                  <SelectItem value="super_admin">
                    Super administrateur
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Valider le formulaire</Button>
        {saved && (
          <p role="status" className="text-sm text-muted-foreground">
            Formulaire valide, aucune donnée n’a été envoyée.
          </p>
        )}
      </form>
    </Form>
  );
}

function CheckboxPreview() {
  const [checked, setChecked] = useState(false);
  const id = useId();
  return (
    <div className="flex items-center gap-2">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(value) => setChecked(value === true)}
      />
      <Label htmlFor={id}>Actualités par e-mail</Label>
    </div>
  );
}

function SwitchPreview() {
  const [enabled, setEnabled] = useState(true);
  const id = useId();
  return (
    <div className="flex items-center gap-2">
      <Switch id={id} checked={enabled} onCheckedChange={setEnabled} />
      <Label htmlFor={id}>Notifications</Label>
    </div>
  );
}

function RadioPreview() {
  const [value, setValue] = useState('weekly');
  const [target, setTarget] = useState('email');
  const id = useId();
  return (
    <div className="grid w-full max-w-sm gap-5">
      <RadioGroup
        value={value}
        onValueChange={setValue}
        aria-label="Fréquence du récapitulatif"
      >
        <div className="flex items-center gap-2">
          <RadioGroupItem value="daily" id={`${id}-daily`} />
          <Label htmlFor={`${id}-daily`}>Quotidien</Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="weekly" id={`${id}-weekly`} />
          <Label htmlFor={`${id}-weekly`}>Hebdomadaire</Label>
        </div>
      </RadioGroup>
      <RadioGroup
        value={target}
        onValueChange={setTarget}
        aria-label="Valeur à bloquer"
      >
        <RadioGroupCard
          value="email"
          label="E-mail"
          description="ana.lopez@northwind.example"
        />
        <RadioGroupCard
          value="domain"
          label="Domaine de l’entreprise"
          description="northwind.example · correspond à 12 contacts"
        />
        <RadioGroupCard
          value="linkedin"
          label="LinkedIn"
          description="Aucun profil LinkedIn"
          disabled
        />
      </RadioGroup>
    </div>
  );
}

function SliderPreview() {
  const [value, setValue] = useState([35]);
  return (
    <div className="w-full max-w-xs space-y-2">
      <Label htmlFor="catalog-volume">Volume: {value[0]}%</Label>
      <Slider
        id="catalog-volume"
        value={value}
        onValueChange={setValue}
        aria-label="Volume"
      />
    </div>
  );
}

function SelectPreview() {
  const [value, setValue] = useState('');
  return (
    <Select value={value} onValueChange={setValue}>
      <SelectTrigger aria-label="Choisir une vue" className="w-48">
        <SelectValue placeholder="Choisissez une vue" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="table">Tableau</SelectItem>
        <SelectItem value="kanban">Kanban</SelectItem>
        <SelectItem value="calendar">Calendrier</SelectItem>
      </SelectContent>
    </Select>
  );
}

const departmentOptions = [
  { value: 'design', label: 'Design' },
  { value: 'engineering', label: 'Ingénierie' },
  { value: 'operations', label: 'Opérations' },
];

function ComboboxPreview() {
  const [value, setValue] = useState('');
  const [inline, setInline] = useState('design');
  return (
    <div className="grid w-full max-w-xs gap-3">
      <Combobox
        options={departmentOptions}
        value={value}
        onValueChange={setValue}
        placeholder="Choisissez un service"
        searchPlaceholder="Rechercher un service"
      />
      <div className="flex items-center gap-1 text-[12.5px] text-[var(--ink-3)]">
        Équipe
        <Combobox
          variant="discrete"
          ariaLabel="Équipe"
          options={departmentOptions}
          value={inline}
          onValueChange={setInline}
          searchPlaceholder="Rechercher un service"
        />
      </div>
    </div>
  );
}

function TimezonePreview() {
  const [value, setValue] = useState('Europe/London');
  return (
    <div className="w-full max-w-xs">
      <span className="mb-2 block text-sm font-medium">Fuseau horaire</span>
      <TimezoneCombobox value={value} onChange={setValue} />
    </div>
  );
}

function OtpPreview() {
  const [value, setValue] = useState('');
  return (
    <InputOTP
      maxLength={6}
      value={value}
      onChange={setValue}
      aria-label="Code de vérification à six chiffres"
    >
      <InputOTPGroup>
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <InputOTPSlot key={index} index={index} />
        ))}
      </InputOTPGroup>
    </InputOTP>
  );
}

function RichTextPreview() {
  const [value, setValue] = useState('<p>Rédigez une courte note.</p>');
  return (
    <fieldset className="w-full max-w-lg">
      <legend className="mb-2 text-sm font-medium">
        Note en texte enrichi
      </legend>
      <RichTextEditor
        value={value}
        onChange={setValue}
        placeholder="Rédigez une courte note"
      />
    </fieldset>
  );
}

function SearchPreview() {
  const [value, setValue] = useState('');
  const [debouncedValue, setDebouncedValue] = useState('');
  return (
    <div className="w-full max-w-sm space-y-2">
      <DebouncedSearchInput
        value={value}
        onChange={setValue}
        onDebouncedChange={setDebouncedValue}
        ariaLabel="Rechercher dans les exemples du catalogue"
        placeholder="Rechercher des exemples"
      />
      <p className="text-xs text-muted-foreground">
        Recherche : {debouncedValue || 'Aucune'}
      </p>
    </div>
  );
}

function TogglePreview() {
  const [pressed, setPressed] = useState(false);
  return (
    <Toggle
      pressed={pressed}
      onPressedChange={setPressed}
      aria-label="Mise en gras"
    >
      Gras
    </Toggle>
  );
}

function ToggleGroupPreview() {
  const [value, setValue] = useState('left');
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(next) => {
        if (next) setValue(next);
      }}
      aria-label="Alignement du texte"
    >
      <ToggleGroupItem value="left">Gauche</ToggleGroupItem>
      <ToggleGroupItem value="center">Centre</ToggleGroupItem>
      <ToggleGroupItem value="right">Droite</ToggleGroupItem>
    </ToggleGroup>
  );
}

function SegmentedPreview() {
  const [value, setValue] = useState<'day' | 'week' | 'month'>('week');
  return (
    <SegmentedControl
      value={value}
      onValueChange={setValue}
      aria-label="Période du rapport"
      items={[
        { value: 'day', label: 'Jour' },
        { value: 'week', label: 'Semaine' },
        { value: 'month', label: 'Mois' },
      ]}
    />
  );
}

export const formGroups: CatalogGroup[] = [
  {
    id: 'text-and-forms',
    title: 'Texte et formulaires',
    description: 'Rédaction, validation et saisies de texte structurées.',
    items: [
      {
        id: 'input',
        name: 'Champ de saisie',
        description: 'Un champ de texte sur une ligne.',
        preview: (
          <Input
            aria-label="Nom du projet"
            placeholder="Nom du projet"
            className="max-w-xs"
          />
        ),
      },
      {
        id: 'textarea',
        name: 'Zone de texte',
        description: 'Une zone de texte multiligne.',
        preview: (
          <Textarea
            aria-label="Description du projet"
            placeholder="Décrivez votre projet"
            className="max-w-xs"
          />
        ),
      },
      {
        id: 'label',
        name: 'Libellé',
        description: 'Un libellé associé à son contrôle.',
        preview: (
          <div className="grid w-full max-w-xs gap-2">
            <Label htmlFor="catalog-label-input">
              Nom de l’espace de travail
            </Label>
            <Input
              id="catalog-label-input"
              placeholder="Mon espace de travail"
            />
          </div>
        ),
      },
      {
        id: 'field',
        name: 'Champ',
        description: 'Un libellé, un contrôle et une aide regroupés.',
        preview: (
          <Field className="max-w-xs">
            <FieldLabel htmlFor="catalog-field-input">Référence</FieldLabel>
            <Input id="catalog-field-input" placeholder="REF-123" />
            <FieldDescription>
              Une référence interne facultative.
            </FieldDescription>
          </Field>
        ),
      },
      {
        id: 'form',
        name: 'Formulaire',
        description: 'Un formulaire local validé par un schéma.',
        preview: <FormPreview />,
      },
      {
        id: 'input-group',
        name: 'Groupe de saisie',
        description: 'Un champ avec un complément intégré.',
        preview: (
          <div className="w-full max-w-xs">
            <InputGroup>
              <InputGroupAddon>
                <InputGroupText>https://</InputGroupText>
              </InputGroupAddon>
              <InputGroupInput
                aria-label="Domaine du site web"
                placeholder="example.com"
              />
            </InputGroup>
          </div>
        ),
      },
      {
        id: 'input-otp',
        name: 'Code à usage unique',
        description: 'Un champ de vérification à six caractères.',
        preview: <OtpPreview />,
      },
      {
        id: 'rich-text-editor',
        name: 'Éditeur de texte enrichi',
        description: 'Un champ de texte enrichi avec barre d’outils.',
        preview: <RichTextPreview />,
      },
      {
        id: 'debounced-search-input',
        name: 'Recherche différée',
        description: 'Un champ de recherche avec une action d’effacement.',
        preview: <SearchPreview />,
      },
    ],
  },
  {
    id: 'choices-and-controls',
    title: 'Choix et contrôles',
    description: 'Sélectionnez, basculez et ajustez des valeurs.',
    items: [
      {
        id: 'checkbox',
        name: 'Case à cocher',
        description: 'Une option binaire.',
        preview: <CheckboxPreview />,
      },
      {
        id: 'radio-group',
        name: 'Boutons radio',
        description:
          'Choisissez une option parmi plusieurs, sous forme de pastilles ou de cartes sélectionnables.',
        preview: <RadioPreview />,
      },
      {
        id: 'switch',
        name: 'Interrupteur',
        description: 'Activez ou désactivez une option.',
        preview: <SwitchPreview />,
      },
      {
        id: 'slider',
        name: 'Curseur',
        description: 'Ajustez une valeur numérique.',
        preview: <SliderPreview />,
      },
      {
        id: 'select',
        name: 'Liste déroulante',
        description: 'Choisissez dans un menu court.',
        preview: <SelectPreview />,
      },
      {
        id: 'combobox',
        name: 'Liste avec recherche',
        description: 'Recherchez et choisissez une option.',
        preview: <ComboboxPreview />,
      },
      {
        id: 'timezone-combobox',
        name: 'Sélecteur de fuseau horaire',
        description: 'Recherchez parmi les fuseaux horaires IANA.',
        preview: <TimezonePreview />,
      },
      {
        id: 'toggle',
        name: 'Bouton bascule',
        description: 'Activez un contrôle de mise en forme unique.',
        preview: <TogglePreview />,
      },
      {
        id: 'toggle-group',
        name: 'Groupe de boutons bascule',
        description: 'Choisissez une option d’alignement.',
        preview: <ToggleGroupPreview />,
      },
      {
        id: 'segmented-control',
        name: 'Contrôle segmenté',
        description: 'Basculez entre les périodes du rapport.',
        preview: <SegmentedPreview />,
      },
    ],
  },
  {
    id: 'dates',
    title: 'Dates et périodes',
    description: 'Choisissez une date ou une période prédéfinie.',
    items: [
      {
        id: 'calendar',
        name: 'Calendrier',
        description: 'Choisissez une date dans un mois d’exemple fixe.',
        preview: <CalendarPreview />,
      },
      {
        id: 'date-picker',
        name: 'Sélecteur de date',
        description: 'Choisissez ou effacez une date du calendrier.',
        preview: <DatePickerPreview />,
      },
      {
        id: 'date-time-picker',
        name: 'Sélecteur de date et d’heure',
        description:
          'Choisissez une date et une heure locales pour un instant UTC.',
        preview: <DateTimePickerPreview />,
      },
      {
        id: 'range-calendar-with-presets',
        name: 'Calendrier de période avec préréglages',
        description: 'Choisissez une période ou un préréglage d’exemple fixe.',
        preview: <RangeCalendarPreview />,
      },
    ],
  },
];
