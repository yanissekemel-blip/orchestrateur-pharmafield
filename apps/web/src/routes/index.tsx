import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { requireSession, signOut } from '../lib/session';
import { HomePage } from './-components/home-page';

export const Route = createFileRoute('/')({
  beforeLoad: requireSession,
  component: Home,
});

function Home() {
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return (
    <HomePage
      user={user}
      onSignOut={async () => {
        try {
          await signOut();
          queryClient.clear();
          await navigate({ to: '/login' });
        } catch {
          toast.error('Déconnexion impossible. Veuillez réessayer.');
        }
      }}
    />
  );
}
