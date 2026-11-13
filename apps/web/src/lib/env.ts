import { z } from 'zod';

const webEnvSchema = z.object({
  VITE_API_URL: z.url(),
  // MapLibre style for maps; OpenFreeMap's free OpenStreetMap style when
  // empty or missing.
  VITE_MAP_STYLE_URL: z.preprocess(
    (value) => (value === '' ? undefined : value),
    z.url().optional(),
  ),
});

// Only public VITE_* variables are injected into the SPA.
export const webEnv = webEnvSchema.parse(import.meta.env);
