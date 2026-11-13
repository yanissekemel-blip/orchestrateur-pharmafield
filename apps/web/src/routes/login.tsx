import { zodResolver } from '@hookform/resolvers/zod';
import {
  type LoginForm,
  loginFormSchema,
  type Role,
} from '@orchestrateur-pharmafield/shared/schemas/auth';
import { Button } from '@orchestrateur-pharmafield/ui/button';
import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Mail, ShieldCheck, UserRound } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { signInAsLocal } from '../lib/dev-login';
import { redirectIfSignedIn, safeReturnPath, signIn } from '../lib/session';
import { AuthField, PasswordField, Submit } from './-auth/form';
import { AuthLayout } from './-auth/layout';

export const Route = createFileRoute('/login')({
  validateSearch: z.object({ returnTo: z.string().optional() }),
  beforeLoad: ({ context, search }) =>
    redirectIfSignedIn({ context }, search.returnTo),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const returnTo = safeReturnPath(Route.useSearch().returnTo);
  const [error, setError] = useState<string | null>(null);
  const [localBusy, setLocalBusy] = useState<Role | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(loginFormSchema) });
  const submit = handleSubmit(async ({ email, password }) => {
    setError(null);
    try {
      if (!(await signIn(email, password))) {
        setError(
          'Connexion impossible. Vérifiez votre e-mail et votre mot de passe.',
        );
        return;
      }
      queryClient.clear();
      await navigate({ to: returnTo });
    } catch {
      setError('Connexion impossible. Veuillez réessayer.');
    }
  });

  const signInLocally = async (role: Role) => {
    setLocalBusy(role);
    setError(null);
    try {
      await signInAsLocal(role);
      queryClient.clear();
      await navigate({ to: returnTo });
    } catch {
      setError('Connexion locale impossible. Veuillez réessayer.');
    } finally {
      setLocalBusy(null);
    }
  };

  return (
    <AuthLayout
      title="Connexion"
      description="Utilisez le compte que votre administrateur a créé pour vous."
    >
      <form onSubmit={submit} className="auth-fields" noValidate>
        <AuthField
          label="E-mail"
          id="login-email"
          icon={Mail}
          type="email"
          autoComplete="email"
          placeholder="vous@pharmafield.fr"
          error={errors.email?.message}
          {...register('email')}
        />
        <PasswordField
          label="Mot de passe"
          id="login-password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password')}
        />
        {error ? (
          <p role="alert" className="auth-field-error">
            {error}
          </p>
        ) : null}
        <Submit busy={isSubmitting} busyLabel="Connexion…">
          Se connecter
        </Submit>
      </form>
      {import.meta.env.DEV && (
        <div className="auth-dev">
          <p>Développement local uniquement</p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <Button
              type="button"
              variant="header"
              disabled={isSubmitting || localBusy !== null}
              onClick={() => signInLocally('admin')}
            >
              <ShieldCheck aria-hidden="true" />
              {localBusy === 'admin' ? 'Connexion…' : 'Admin local'}
            </Button>
            <Button
              type="button"
              variant="header"
              disabled={isSubmitting || localBusy !== null}
              onClick={() => signInLocally('user')}
            >
              <UserRound aria-hidden="true" />
              {localBusy === 'user' ? 'Connexion…' : 'Utilisateur local'}
            </Button>
          </div>
        </div>
      )}
    </AuthLayout>
  );
}
