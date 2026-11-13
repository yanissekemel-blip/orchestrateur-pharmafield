import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { HomePage } from '../src/routes/-components/home-page';

const account = {
  id: 'u1',
  name: 'Camille Martin',
  email: 'camille@example.test',
};

describe('HomePage', () => {
  it('shows the signed-in administrator and their role in French', () => {
    render(
      <HomePage user={{ ...account, role: 'admin' }} onSignOut={vi.fn()} />,
    );
    expect(
      screen.getByRole('heading', { name: 'Orchestrateur Pharmafield' }),
    ).toBeTruthy();
    expect(screen.getByText('Camille Martin')).toBeTruthy();
    expect(screen.getByText('Administrateur')).toBeTruthy();
  });

  it('labels a standard account as a user', () => {
    render(
      <HomePage user={{ ...account, role: 'user' }} onSignOut={vi.fn()} />,
    );
    expect(screen.getByText('Utilisateur')).toBeTruthy();
    expect(screen.queryByText('Administrateur')).toBeNull();
  });

  it('signs out from the button', async () => {
    const onSignOut = vi.fn();
    render(
      <HomePage user={{ ...account, role: 'user' }} onSignOut={onSignOut} />,
    );
    await userEvent.click(
      screen.getByRole('button', { name: 'Se déconnecter' }),
    );
    expect(onSignOut).toHaveBeenCalledOnce();
  });
});
