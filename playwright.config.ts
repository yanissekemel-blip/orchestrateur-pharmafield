import { existsSync, readFileSync } from 'node:fs';
import { defineConfig, devices } from '@playwright/test';

const baseURL =
  process.env.WEB_URL ?? 'http://orchestrateur-pharmafield.localhost';
// Bun's DNS resolver does not resolve .localhost subdomains on every platform.
// Probe the running servers directly, while browsers use the Caddy hostnames.
const localEnv = existsSync('.env.local')
  ? readFileSync('.env.local', 'utf8')
  : '';
const activePorts = existsSync('.env.ports')
  ? readFileSync('.env.ports', 'utf8')
  : '';
const apiPort =
  activePorts.match(/^API_DEV_PORT=(\d+)$/m)?.[1] ||
  process.env.API_DEV_PORT ||
  process.env.PORT ||
  '3000';
const webPort =
  activePorts.match(/^WEB_DEV_PORT=(\d+)$/m)?.[1] ||
  process.env.WEB_DEV_PORT ||
  localEnv.match(/^WEB_DEV_PORT=(\d+)$/m)?.[1] ||
  '5173';

export default defineConfig({
  testDir: './e2e',
  webServer: [
    {
      command: 'bun run dev:api',
      url: `http://127.0.0.1:${apiPort}/openapi.json`,
      env: { PORT: apiPort },
      reuseExistingServer: true,
      timeout: 120_000,
    },
    {
      command: 'bun run --cwd apps/api dev:worker',
      wait: { stdout: /Worker started/ },
      reuseExistingServer: true,
      timeout: 120_000,
    },
    {
      command: 'bun run dev:web',
      url: `http://127.0.0.1:${webPort}`,
      env: { WEB_DEV_PORT: webPort },
      reuseExistingServer: true,
      timeout: 120_000,
    },
  ],
  use: {
    baseURL,
    ...devices['Desktop Chrome'],
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
});
