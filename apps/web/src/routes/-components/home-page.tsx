import { Button } from '@orchestrateur-pharmafield/ui/button';
import { Panel } from '@orchestrateur-pharmafield/ui/panel';
import { PharmafieldLogo } from '@orchestrateur-pharmafield/ui/pharmafield-logo';
import { RolePill } from '@orchestrateur-pharmafield/ui/status-pill';
import { LogOut } from 'lucide-react';
import { roleLabels, type SessionUser } from '../../lib/session';

export function HomePage({
  user,
  onSignOut,
}: {
  user: SessionUser;
  onSignOut: () => void;
}) {
  return (
    <main className="grid min-h-svh place-items-center p-6">
      <Panel className="flex w-full max-w-md flex-col items-center gap-5 p-10 text-center">
        <PharmafieldLogo height={44} title="Pharmafield Groupe" />
        <h1 className="font-display text-2xl">Orchestrateur Pharmafield</h1>
        <div className="flex flex-col items-center gap-2">
          <p>
            Connecté en tant que <strong>{user.name}</strong>
          </p>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          <RolePill tone={user.role === 'admin' ? 'admin' : 'sage'}>
            {roleLabels[user.role]}
          </RolePill>
        </div>
        <Button variant="outline" onClick={onSignOut}>
          <LogOut aria-hidden="true" />
          Se déconnecter
        </Button>
      </Panel>
    </main>
  );
}
