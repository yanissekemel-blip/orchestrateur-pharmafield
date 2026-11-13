import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  createMemoryHistory,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, it, vi } from 'vitest';
import { routeTree } from '../src/routeTree.gen';

type Account = { name: string; role: string };

/** Fakes the Better Auth endpoints: one account, one password. */
function stubAuth(account: Account, password = 'correct-password') {
  let signedIn = false;
  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { 'content-type': 'application/json' },
    });
  const user = { id: 'u1', email: 'camille@example.test', ...account };
  const fetchMock = vi.fn(
    async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = new URL(input instanceof Request ? input.url : String(input));
      if (url.pathname === '/api/auth/get-session')
        return json(signedIn ? { user, session: { id: 's1' } } : null);
      const local = url.pathname.match(/^\/api\/dev\/login\/(admin|user)$/);
      if (local) {
        signedIn = true;
        const role = local[1] ?? 'user';
        user.role = role;
        user.name =
          role === 'admin' ? 'Administrateur local' : 'Utilisateur local';
        return json({ user, token: 't' });
      }
      if (url.pathname === '/api/auth/sign-in/email') {
        const body = JSON.parse(String(init?.body)) as { password: string };
        if (body.password !== password)
          return json({ code: 'INVALID_EMAIL_OR_PASSWORD' }, 401);
        signedIn = true;
        return json({ user, token: 't' });
      }
      return json(null, 404);
    },
  );
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

function renderApp(path: string) {
  const queryClient = new QueryClient();
  const router = createRouter({
    routeTree,
    context: { queryClient },
    history: createMemoryHistory({ initialEntries: [path] }),
  });
  render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
  return router;
}

async function fillAndSubmit(email: string, password: string) {
  const user = userEvent.setup();
  await user.type(await screen.findByLabelText('E-mail'), email);
  await user.type(screen.getByLabelText('Mot de passe'), password);
  await user.click(screen.getByRole('button', { name: 'Se connecter' }));
}

afterEach(() => vi.unstubAllGlobals());

it('sends a signed-out visitor to the login page', async () => {
  stubAuth({ name: 'Camille Martin', role: 'admin' });
  const router = renderApp('/');
  expect(
    await screen.findByRole('heading', { name: 'Connexion' }),
  ).toBeTruthy();
  expect(router.state.location.pathname).toBe('/login');
});

it.each([
  ['admin', 'Administrateur'],
  ['user', 'Utilisateur'],
])('signs a %s in and shows their role', async (role, label) => {
  stubAuth({ name: 'Camille Martin', role });
  const router = renderApp('/login');
  await fillAndSubmit('camille@example.test', 'correct-password');
  expect(await screen.findByText(label)).toBeTruthy();
  expect(screen.getByText('Camille Martin')).toBeTruthy();
  expect(router.state.location.pathname).toBe('/');
});

it('validates the fields before calling the API', async () => {
  const fetchMock = stubAuth({ name: 'Camille Martin', role: 'user' });
  renderApp('/login');
  const user = userEvent.setup();
  await user.type(await screen.findByLabelText('E-mail'), 'pas-un-email');
  await user.click(screen.getByRole('button', { name: 'Se connecter' }));
  expect(
    await screen.findByText('Saisissez une adresse e-mail valide.'),
  ).toBeTruthy();
  expect(screen.getByText('Saisissez votre mot de passe.')).toBeTruthy();
  expect(
    fetchMock.mock.calls.some(([input]) => String(input).includes('sign-in')),
  ).toBe(false);
});

it('reports refused credentials and stays on the login page', async () => {
  stubAuth({ name: 'Camille Martin', role: 'user' });
  const router = renderApp('/login');
  await fillAndSubmit('camille@example.test', 'wrong-password');
  expect(
    await screen.findByText(
      'Connexion impossible. Vérifiez votre e-mail et votre mot de passe.',
    ),
  ).toBeTruthy();
  expect(router.state.location.pathname).toBe('/login');
});

it.each([
  ['Admin local', 'Administrateur'],
  ['Utilisateur local', 'Utilisateur'],
])('signs in with the « %s » development button', async (button, label) => {
  stubAuth({ name: 'Camille Martin', role: 'user' });
  const router = renderApp('/login');
  await userEvent.click(await screen.findByRole('button', { name: button }));
  expect(await screen.findByText(label)).toBeTruthy();
  expect(router.state.location.pathname).toBe('/');
});
