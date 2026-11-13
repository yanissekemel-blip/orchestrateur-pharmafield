import { Button } from '@orchestrateur-pharmafield/ui/button';
import { Panel } from '@orchestrateur-pharmafield/ui/panel';
import { PharmafieldLogo } from '@orchestrateur-pharmafield/ui/pharmafield-logo';

export function HomePage() {
  return (
    <main className="grid min-h-svh place-items-center p-6">
      <Panel className="flex w-full max-w-md flex-col items-center gap-5 p-10 text-center">
        <PharmafieldLogo height={44} title="Pharmafield Groupe" />
        <h1 className="font-display text-2xl">Orchestrateur Pharmafield</h1>
        <p className="text-muted-foreground">Le projet est initialisé.</p>
        <Button>Commencer</Button>
      </Panel>
    </main>
  );
}
