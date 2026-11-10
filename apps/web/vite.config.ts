import tailwindcss from '@tailwindcss/vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import { z } from 'zod';

export default defineConfig(({ mode }) => {
  // Fail at startup or build time if the public URL is invalid.
  const localEnv = loadEnv(mode, '../..', ['VITE_', 'WEB_DEV_PORT', 'WEB_URL']);
  const { WEB_URL } = z
    .object({ VITE_API_URL: z.url(), WEB_URL: z.url() })
    .parse(localEnv);
  return {
    envDir: '../..',
    plugins: [
      {
        name: 'canonical-development-origin',
        configureServer(server) {
          server.middlewares.use((request, response, next) => {
            const host = request.headers.host;
            const hostname = host
              ? new URL(`http://${host}`).hostname
              : undefined;
            if (
              request.method !== 'GET' ||
              !request.headers.accept?.includes('text/html') ||
              !['localhost', '127.0.0.1', '[::1]'].includes(hostname ?? '')
            ) {
              next();
              return;
            }
            const path = new URL(request.url ?? '/', 'http://localhost');
            const target = new URL(WEB_URL);
            target.pathname = path.pathname;
            target.search = path.search;
            response.statusCode = 307;
            response.setHeader('Location', target.href);
            response.end();
          });
        },
      },
      tanstackRouter({ target: 'react', autoCodeSplitting: true }),
      react(),
      tailwindcss(),
    ],
    server: {
      host: '0.0.0.0',
      port: Number(process.env.WEB_DEV_PORT ?? localEnv.WEB_DEV_PORT ?? '0'),
      strictPort: true,
      allowedHosts: ['orchestrateur-pharmafield.localhost'],
    },
  };
});
