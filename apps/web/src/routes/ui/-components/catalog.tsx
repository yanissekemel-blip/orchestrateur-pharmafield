import { Badge } from '@orchestrateur-pharmafield/ui/badge';
import { Input } from '@orchestrateur-pharmafield/ui/input';
import { Panel } from '@orchestrateur-pharmafield/ui/panel';
import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { CatalogGroup } from './catalog-types';
import { dataGroups } from './data';
import { formGroups } from './forms';
import { foundationGroups } from './foundations';
import { mediaGroups } from './media';
import { motionGroups } from './motion';
import { navigationGroups } from './navigation';
import { overlayGroups } from './overlays';
import { phoneGroups } from './phone';
import { recordGroups } from './records';
import { scheduleGroups } from './schedules';

export const catalogGroups: CatalogGroup[] = [
  ...foundationGroups,
  ...motionGroups,
  ...navigationGroups,
  ...formGroups,
  ...scheduleGroups,
  ...overlayGroups,
  ...dataGroups,
  ...recordGroups,
  ...mediaGroups,
  ...phoneGroups,
];

export function Catalog() {
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    return catalogGroups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) =>
          `${item.name} ${item.description}`
            .toLocaleLowerCase()
            .includes(needle),
        ),
      }))
      .filter((group) => group.items.length > 0);
  }, [query]);
  const count = filtered.reduce(
    (total, group) => total + group.items.length,
    0,
  );

  return (
    <main className="mx-auto min-h-screen max-w-[1600px] px-4 pb-20 pt-8 text-foreground sm:px-8 lg:pt-12">
      <Panel asChild padding="lg">
        <header>
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="secondary">Développement uniquement</Badge>
            <span className="font-mono text-xs text-muted-foreground">
              React + Tailwind
            </span>
          </div>
          <h1 className="mt-5 text-3xl font-heading sm:text-4xl">
            Le catalogue de composants
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Un aperçu fonctionnel du design system Pharmafield. Chaque famille
            de composants apparaît une fois ; les interactions utilisent des
            données d’exemple locales et ne modifient pas votre compte.
          </p>
          <p className="mt-5 text-xs text-muted-foreground">
            {catalogGroups.reduce(
              (total, group) => total + group.items.length,
              0,
            )}{' '}
            exemples répartis en {catalogGroups.length} sections
          </p>
        </header>
      </Panel>

      <div className="mt-7 gap-8 lg:grid lg:grid-cols-[210px_minmax(0,1fr)] xl:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="mb-7 self-start lg:sticky lg:top-6 lg:mb-0">
          <Panel asChild>
            <nav aria-label="Sections du catalogue">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Parcourir
              </p>
              <ul className="space-y-1">
                {filtered.map((group) => (
                  <li key={group.id}>
                    <a
                      href={`#${group.id}`}
                      className="flex items-center justify-between gap-2 rounded-[var(--radius-md)] px-2 py-2 text-sm text-foreground hover:bg-[var(--charcoal-a06)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-emphasis"
                    >
                      <span className="min-w-0 truncate">{group.title}</span>
                      <span className="font-mono text-xs text-muted-foreground">
                        {group.items.length}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
              <p className="mt-4 border-t pt-3 text-xs leading-relaxed text-muted-foreground">
                Utilisez Tab pour atteindre chaque exemple interactif. Les
                animations suivent la préférence de votre système.
              </p>
            </nav>
          </Panel>
        </aside>

        <div className="min-w-0">
          <div className="relative mb-7 max-w-lg">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label="Rechercher des composants"
              placeholder="Rechercher dans les composants et descriptions"
              className="w-full pl-9"
            />
          </div>
          <p role="status" className="mb-6 text-xs text-muted-foreground">
            {count} {count < 2 ? 'exemple affiché' : 'exemples affichés'}
          </p>
          {filtered.length === 0 ? (
            <Panel padding="lg" className="border-dashed text-center">
              <p className="text-[13.5px] font-extrabold">
                Aucun composant correspondant
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Essayez un autre terme de recherche.
              </p>
            </Panel>
          ) : (
            filtered.map((group) => (
              <section
                key={group.id}
                id={group.id}
                aria-labelledby={`${group.id}-heading`}
                className="mb-12 scroll-mt-6"
              >
                <div className="mb-5">
                  <p className="mb-1 font-mono text-xs text-primary-emphasis">
                    {group.items.length} COMPOSANTS
                  </p>
                  <h2
                    id={`${group.id}-heading`}
                    className="text-2xl font-heading"
                  >
                    {group.title}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {group.description}
                  </p>
                </div>
                <div className="grid items-stretch gap-4 md:grid-cols-2 2xl:grid-cols-3">
                  {group.items.map((item) => (
                    <Panel asChild padding="none" key={item.id}>
                      <article
                        id={item.id}
                        aria-labelledby={`${item.id}-heading`}
                        className={`min-w-0 scroll-mt-6 overflow-hidden ${item.wide ? 'md:col-span-2 2xl:col-span-3' : ''}`}
                      >
                        <div className="px-5 pt-4">
                          <h3
                            id={`${item.id}-heading`}
                            className="text-[13.5px] font-heading"
                          >
                            {item.name}
                          </h3>
                          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                            {item.description}
                          </p>
                        </div>
                        <div className="flex min-h-28 min-w-0 flex-wrap items-center gap-3 overflow-visible p-5">
                          {item.preview}
                        </div>
                      </article>
                    </Panel>
                  ))}
                </div>
              </section>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
