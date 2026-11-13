import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('../src/routes/ui/-components/foundations', () => ({
  foundationGroups: [
    {
      id: 'foundations',
      title: 'Fondations',
      description: 'Bases',
      items: [
        {
          id: 'button',
          name: 'Bouton',
          description: 'Action cliquable',
          preview: <button type="button">Bouton d’exemple</button>,
        },
      ],
    },
  ],
}));
vi.mock('../src/routes/ui/-components/navigation', () => ({
  navigationGroups: [],
}));
vi.mock('../src/routes/ui/-components/forms', () => ({
  formGroups: [
    {
      id: 'forms',
      title: 'Formulaires',
      description: 'Saisies',
      items: [
        {
          id: 'input',
          name: 'Champ',
          description: 'Champ sur une ligne',
          preview: <input aria-label="Champ d’exemple" />,
        },
      ],
    },
  ],
}));
vi.mock('../src/routes/ui/-components/overlays', () => ({ overlayGroups: [] }));
vi.mock('../src/routes/ui/-components/data', () => ({ dataGroups: [] }));
vi.mock('../src/routes/ui/-components/motion', () => ({ motionGroups: [] }));

import { Catalog, catalogGroups } from '../src/routes/ui/-components/catalog';

afterEach(cleanup);

describe('development component catalog', () => {
  it('shows each example once in its category and links to the section', () => {
    render(<Catalog />);
    expect(
      screen.getByRole('heading', { name: 'Le catalogue de composants' }),
    ).toBeTruthy();
    expect(
      screen
        .getAllByRole('status')
        .some((item) =>
          item.textContent?.includes(
            `${catalogGroups.flatMap((group) => group.items).length} exemples affichés`,
          ),
        ),
    ).toBe(true);
    const sections = screen.getByRole('navigation', {
      name: 'Sections du catalogue',
    });
    expect(
      within(sections)
        .getByRole('link', { name: /Fondations/ })
        .getAttribute('href'),
    ).toBe('#foundations');
    expect(screen.getAllByRole('heading', { name: 'Bouton' })).toHaveLength(1);
    expect(
      screen.getByRole('button', { name: 'Bouton d’exemple' }),
    ).toBeTruthy();
  });

  it('filters by name or description and explains empty results', async () => {
    const user = userEvent.setup();
    render(<Catalog />);
    await user.type(
      screen.getByRole('searchbox', { name: 'Rechercher des composants' }),
      'une ligne',
    );
    expect(screen.getByRole('status').textContent).toContain(
      '1 exemple affiché',
    );
    expect(screen.getByRole('heading', { name: 'Champ' })).toBeTruthy();
    expect(screen.queryByRole('heading', { name: 'Bouton' })).toBeNull();
    await user.clear(
      screen.getByRole('searchbox', { name: 'Rechercher des composants' }),
    );
    await user.type(
      screen.getByRole('searchbox', { name: 'Rechercher des composants' }),
      'introuvable',
    );
    expect(screen.getByRole('status').textContent).toContain(
      '0 exemple affiché',
    );
    expect(screen.getByText('Aucun composant correspondant')).toBeTruthy();
  });
});
