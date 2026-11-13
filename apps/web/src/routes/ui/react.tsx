import {
  createFileRoute,
  lazyRouteComponent,
  notFound,
} from '@tanstack/react-router';

export const Route = createFileRoute('/ui/react')({
  beforeLoad: () => {
    if (!import.meta.env.DEV) throw notFound();
  },
  component: import.meta.env.DEV
    ? lazyRouteComponent(() => import('./-components/catalog'), 'Catalog')
    : () => null,
});
