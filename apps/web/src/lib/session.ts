import {
  ROLES,
  type Role,
  roleSchema,
} from '@orchestrateur-pharmafield/shared/schemas/auth';
import type { QueryClient } from '@tanstack/react-query';
import { redirect } from '@tanstack/react-router';
import { authClient } from './auth-client';

export const sessionKey = ['auth', 'session'] as const;

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

export const roleLabels: Record<Role, string> = {
  user: 'Utilisateur',
  admin: 'Administrateur',
};

/** The signed-in user, or `null` when there is no session. */
export async function getSessionUser(): Promise<SessionUser | null> {
  const result = await authClient.getSession();
  if (result.error)
    throw new Error(
      'Impossible de vérifier votre session. Veuillez réessayer.',
    );
  if (!result.data) return null;
  const { id, name, email, role } = result.data.user;
  // An unknown role gets the least privilege.
  return { id, name, email, role: roleSchema.catch(ROLES.USER).parse(role) };
}

/** Returns `false` when the credentials are refused. */
export async function signIn(email: string, password: string) {
  const result = await authClient.signIn.email({ email, password });
  return !result.error;
}

export async function signOut() {
  const result = await authClient.signOut();
  if (result.error) throw new Error('Déconnexion impossible.');
}

/** Only same-origin paths are accepted as a post-login destination. */
export function safeReturnPath(path: string | undefined): string {
  if (!path) return '/';
  if (
    !path.startsWith('/') ||
    path.startsWith('//') ||
    [...path].some(
      (char) =>
        char === '\\' || char.charCodeAt(0) < 32 || char.charCodeAt(0) === 127,
    ) ||
    /%(?:2f|5c|0[0-9a-f]|1[0-9a-f]|7f)/i.test(path)
  )
    return '/';
  return path;
}

type GuardArgs = {
  context: { queryClient: QueryClient };
  location: { href: string };
};

function loadSessionUser({ context }: Pick<GuardArgs, 'context'>) {
  return context.queryClient.fetchQuery({
    queryKey: sessionKey,
    queryFn: getSessionUser,
    staleTime: 0,
  });
}

/**
 * Route guard for signed-in pages: redirects to the login page, which comes
 * back to the requested page. The server still enforces every permission.
 */
export async function requireSession(args: GuardArgs) {
  const user = await loadSessionUser(args);
  if (!user)
    throw redirect({ to: '/login', search: { returnTo: args.location.href } });
  return { user };
}

/** Route guard for the login page: a signed-in user goes straight on. */
export async function redirectIfSignedIn(
  args: Pick<GuardArgs, 'context'>,
  returnTo: string | undefined,
) {
  const user = await loadSessionUser(args).catch(() => null);
  if (user) throw redirect({ to: safeReturnPath(returnTo) });
}
