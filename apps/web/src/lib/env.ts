import { z } from 'zod';

const webEnvSchema = z.object({ VITE_API_URL: z.url() });

// Only public VITE_* variables are injected into the SPA.
export const webEnv = webEnvSchema.parse(import.meta.env);
