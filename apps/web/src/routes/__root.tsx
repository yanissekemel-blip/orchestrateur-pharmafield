import { Toaster } from '@orchestrateur-pharmafield/ui/components/sonner';
import type { QueryClient } from '@tanstack/react-query';
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    component: () => (
      <>
        <Outlet />
        <Toaster position="bottom-right" />
      </>
    ),
    notFoundComponent: () => (
      <main className="grid min-h-svh place-items-center p-6">
        <p className="text-muted-foreground">Page introuvable</p>
      </main>
    ),
  },
);
