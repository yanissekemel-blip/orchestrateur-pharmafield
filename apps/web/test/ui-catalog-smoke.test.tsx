import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, it, vi } from 'vitest';
import { Catalog } from '../src/routes/ui/-components/catalog';

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

it('renders all catalog sections without requesting application data', () => {
  const fetchMock = vi.fn();
  vi.stubGlobal('fetch', fetchMock);
  render(<Catalog />);
  expect(
    screen.getByRole('heading', { name: 'Le catalogue de composants' }),
  ).toBeTruthy();
  expect(
    screen.getByRole('heading', { name: 'Graphiques et carte de graphique' }),
  ).toBeTruthy();
  expect(screen.getByRole('heading', { name: 'SettingsModal' })).toBeTruthy();
  expect(fetchMock).not.toHaveBeenCalled();
});

it('validates the form preview locally', async () => {
  const user = userEvent.setup();
  const fetchMock = vi.fn();
  vi.stubGlobal('fetch', fetchMock);
  render(<Catalog />);
  await user.click(
    screen.getByRole('button', { name: 'Valider le formulaire' }),
  );
  expect(
    await screen.findByText('Saisissez au moins deux caractères.'),
  ).toBeTruthy();
  await user.type(screen.getByRole('textbox', { name: 'Nom affiché' }), 'Ada');
  await user.click(
    screen.getByRole('button', { name: 'Valider le formulaire' }),
  );
  expect(
    await screen.findByText(
      'Formulaire valide, aucune donnée n’a été envoyée.',
    ),
  ).toBeTruthy();
  expect(fetchMock).not.toHaveBeenCalled();
});

it('opens and closes a dialog preview without saving anything', async () => {
  const user = userEvent.setup();
  render(<Catalog />);
  await user.click(
    screen.getByRole('button', { name: 'Ouvrir la boîte de dialogue' }),
  );
  expect(screen.getByRole('dialog')).toBeTruthy();
  expect(
    screen.getByRole('heading', { name: 'Boîte de dialogue d’exemple' }),
  ).toBeTruthy();
  await user.click(
    screen.getByRole('button', { name: 'Fermer la boîte de dialogue' }),
  );
  await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
});
