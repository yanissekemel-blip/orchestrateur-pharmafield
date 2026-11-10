import { Button } from '@orchestrateur-pharmafield/ui/components/button';

export function HomePage() {
  return (
    <main className="grid min-h-svh place-items-center p-6">
      <div className="flex flex-col items-center gap-4 text-center">
        <h1 className="text-2xl font-semibold">Orchestrateur Pharmafield</h1>
        <p className="text-muted-foreground">Le projet est initialisé.</p>
        <Button>Commencer</Button>
      </div>
    </main>
  );
}
