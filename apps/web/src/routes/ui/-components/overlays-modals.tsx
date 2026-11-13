import { Button } from '@orchestrateur-pharmafield/ui/button';
import { Input } from '@orchestrateur-pharmafield/ui/input';
import { Label } from '@orchestrateur-pharmafield/ui/label';
import {
  MultiStepModal,
  SettingsModal,
  type SettingsModalTab,
  SettingsRow,
  SettingsSection,
} from '@orchestrateur-pharmafield/ui/modals';
import { Switch } from '@orchestrateur-pharmafield/ui/switch';
import { Bell, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';

export function MultiStepPreview() {
  const [step, setStep] = useState(0);
  return (
    <MultiStepModal
      trigger={
        <Button variant="outline">Ouvrir la fenêtre en plusieurs étapes</Button>
      }
      title="Créer un espace de travail d’exemple"
      description="Découvrez un parcours local en deux étapes, sans rien enregistrer."
      steps={[
        { id: 'details', label: 'Détails' },
        { id: 'review', label: 'Vérification' },
      ]}
      currentStep={step}
      onOpenChange={(open) => {
        if (!open) setStep(0);
      }}
      onPrevious={() => setStep(0)}
      onNext={() => setStep(1)}
      onSubmit={(event) => {
        event.preventDefault();
        setStep(0);
      }}
      submitLabel="Relancer la démo"
    >
      <p className="text-sm text-[var(--ink-2)]">
        {step === 0
          ? 'Commencez par les détails, puis vérifiez l’exemple.'
          : 'Ceci n’est qu’un aperçu. Relancez pour revenir à la première étape.'}
      </p>
    </MultiStepModal>
  );
}

const settingsTabs: SettingsModalTab[] = [
  {
    id: 'general',
    label: 'Général',
    icon: SlidersHorizontal,
    group: 'Espace de travail',
    description: 'Préférences d’un espace de travail d’exemple.',
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: Bell,
    group: 'Espace de travail',
    description: 'Choisissez ce qui arrive dans votre boîte de réception.',
  },
];

export function SettingsPreview() {
  const [open, setOpen] = useState(false);
  const [digest, setDigest] = useState(true);
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Ouvrir la fenêtre des paramètres
      </Button>
      <SettingsModal
        open={open}
        onOpenChange={setOpen}
        title="Paramètres d’exemple"
        description="Aperçu uniquement"
        tabs={settingsTabs}
      >
        {(activeTab) =>
          activeTab === 'general' ? (
            <SettingsSection title="Espace de travail">
              <SettingsRow
                label="Nom de l’espace de travail"
                description="Visible par tous les membres de l’espace de travail."
              >
                <Input
                  aria-label="Nom de l’espace de travail"
                  defaultValue="Northwind"
                  className="max-w-56"
                />
              </SettingsRow>
            </SettingsSection>
          ) : (
            <SettingsSection title="E-mail">
              <SettingsRow
                label={
                  <Label htmlFor="preview-digest">
                    Récapitulatif hebdomadaire
                  </Label>
                }
                description="Un résumé de l’activité chaque lundi."
              >
                <Switch
                  id="preview-digest"
                  checked={digest}
                  onCheckedChange={setDigest}
                />
              </SettingsRow>
            </SettingsSection>
          )
        }
      </SettingsModal>
    </>
  );
}
