import { z } from 'zod';

const envSchema = z
  .object({
    NODE_ENV: z
      .enum(['development', 'test', 'production'])
      .default('development'),
    PORT: z.coerce.number().int().min(1).max(65535).default(3000),
    WEB_URL: z.url().default('http://orchestrateur-pharmafield.localhost'),
    API_URL: z.url().default('http://api.orchestrateur-pharmafield.localhost'),
    DATABASE_URL: z.string().min(1),
    BETTER_AUTH_SECRET: z.string().min(32),
    SMTP_HOST: z.string().min(1).default('127.0.0.1'),
    SMTP_PORT: z.coerce.number().int().min(1).max(65535).default(1027),
    SMTP_FROM: z
      .email()
      .default('no-reply@orchestrateur-pharmafield.localhost'),
    SMTP_SECURE: z.stringbool().default(false),
    SMTP_USER: z.string().default(''),
    SMTP_PASSWORD: z.string().default(''),
    LOG_LEVEL: z
      .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'])
      .default('info'),
  })
  .refine(
    (value) =>
      value.NODE_ENV !== 'production' ||
      !['debug', 'trace'].includes(value.LOG_LEVEL),
    { path: ['LOG_LEVEL'], message: 'Debug logging is disabled in production' },
  )
  .refine(
    (value) =>
      value.NODE_ENV !== 'production' ||
      (value.SMTP_HOST !== '127.0.0.1' &&
        value.SMTP_HOST !== 'localhost' &&
        value.SMTP_USER.length > 0 &&
        value.SMTP_PASSWORD.length > 0 &&
        !value.SMTP_FROM.endsWith('.localhost')),
    {
      path: ['SMTP_HOST'],
      message: 'Production SMTP must use a configured provider',
    },
  );

export type Env = z.infer<typeof envSchema>;

export function loadEnv(
  source: Record<string, string | undefined> = process.env,
): Env {
  return envSchema.parse(source);
}

export const env = loadEnv();
