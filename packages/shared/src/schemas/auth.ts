import { z } from 'zod';

/** Global roles. `admin` manages the platform; `user` is the default. */
export const ROLES = { USER: 'user', ADMIN: 'admin' } as const;

export const roleSchema = z.enum([ROLES.USER, ROLES.ADMIN]);

export type Role = z.infer<typeof roleSchema>;

export const emailSchema = z
  .email('Saisissez une adresse e-mail valide.')
  .max(320);

export const loginFormSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Saisissez votre mot de passe.'),
});

export type LoginForm = z.infer<typeof loginFormSchema>;
