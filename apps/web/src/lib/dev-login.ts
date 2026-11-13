import type { Role } from '@orchestrateur-pharmafield/shared/schemas/auth';
import { webEnv } from './env';

/** Local development only: signs in as the local admin or user account. */
export async function signInAsLocal(role: Role): Promise<void> {
  const response = await fetch(
    new URL(`/api/dev/login/${role}`, webEnv.VITE_API_URL),
    { method: 'POST', credentials: 'include' },
  );
  if (!response.ok) throw new Error('Local sign-in failed');
}
