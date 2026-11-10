export type DevPortKey = 'API_DEV_PORT' | 'WEB_DEV_PORT';

export function parsePort(value: string | undefined): number | undefined {
  if (!value || !/^\d+$/.test(value)) return undefined;
  const port = Number(value);
  return Number.isInteger(port) && port > 0 && port <= 65_535
    ? port
    : undefined;
}

export function savedPort(
  contents: string,
  key: DevPortKey,
): number | undefined {
  return parsePort(contents.match(new RegExp(`^${key}=(\\d+)\\s*$`, 'm'))?.[1]);
}

export function withDevPorts(
  contents: string,
  ports: Record<DevPortKey, number>,
): string {
  let updated = contents.replace(/\r\n/g, '\n').trimEnd();
  for (const key of ['API_DEV_PORT', 'WEB_DEV_PORT'] as const) {
    const entry = `${key}=${ports[key]}`;
    updated = new RegExp(`^${key}=.*$`, 'm').test(updated)
      ? updated.replace(new RegExp(`^${key}=.*$`, 'm'), entry)
      : `${updated}${updated ? '\n' : ''}${entry}`;
  }
  return `${updated}\n`;
}

// Keep reservations open until both ports are selected to avoid selecting the
// same ephemeral port twice. Release immediately before starting the servers.
export function reservePort(preferred?: number): ReturnType<typeof Bun.serve> {
  const fetch = () => new Response('ready');
  if (preferred) {
    try {
      return Bun.serve({ hostname: '0.0.0.0', port: preferred, fetch });
    } catch {
      // An occupied preferred port is expected when a previous dev run lives on.
    }
  }
  return Bun.serve({ hostname: '0.0.0.0', port: 0, fetch });
}
