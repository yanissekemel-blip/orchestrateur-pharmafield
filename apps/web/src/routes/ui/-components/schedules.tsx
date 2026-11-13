import { TimeSelect } from '@orchestrateur-pharmafield/ui/time-select';
import {
  type WeeklyRange,
  WeeklySchedule,
} from '@orchestrateur-pharmafield/ui/weekly-schedule';
import { useState } from 'react';
import type { CatalogGroup } from './catalog-types';

const sampleDays = [
  { value: 1, label: 'Lundi', short: 'Lun' },
  { value: 2, label: 'Mardi', short: 'Mar' },
  { value: 3, label: 'Mercredi', short: 'Mer' },
  { value: 4, label: 'Jeudi', short: 'Jeu' },
  { value: 5, label: 'Vendredi', short: 'Ven' },
  { value: 6, label: 'Samedi', short: 'Sam', weekend: true },
  { value: 7, label: 'Dimanche', short: 'Dim', weekend: true },
];

function TimeSelectPreview() {
  const [value, setValue] = useState('09:30');
  return (
    <div className="w-40">
      <TimeSelect
        aria-label="Heure d’exemple"
        value={value}
        onValueChange={setValue}
      />
    </div>
  );
}

function WeeklySchedulePreview() {
  const [ranges, setRanges] = useState<WeeklyRange[]>([
    { day: 1, start: '09:00', end: '12:00' },
    { day: 1, start: '13:00', end: '17:00' },
    { day: 3, start: '09:00', end: '17:00' },
    { day: 5, start: '22:00', end: '02:00' },
  ]);
  return (
    <WeeklySchedule
      days={sampleDays}
      ranges={ranges}
      onChange={setRanges}
      className="w-full"
    />
  );
}

export const scheduleGroups: CatalogGroup[] = [
  {
    id: 'times-and-schedules',
    title: 'Heures et plannings',
    description: 'Heures locales et plages horaires hebdomadaires.',
    items: [
      {
        id: 'time-select',
        name: 'Sélecteur d’heure',
        description:
          'Choisissez une heure de la journée par pas de 15 minutes.',
        preview: <TimeSelectPreview />,
      },
      {
        id: 'weekly-schedule',
        name: 'Planning hebdomadaire',
        description:
          'Faites glisser pour ajouter ou redimensionner des plages horaires hebdomadaires, ou modifiez-les, ajoutez-en et copiez-les ; les plages qui se chevauchent fusionnent et celles qui passent minuit se prolongent sur le jour suivant.',
        preview: <WeeklySchedulePreview />,
        wide: true,
      },
    ],
  },
];
