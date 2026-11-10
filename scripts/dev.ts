import { parsePort, reservePort, savedPort, withDevPorts } from './dev-ports';

const reset = '\x1b[0m';
const dim = '\x1b[2m';
const cyan = '\x1b[36m';
const blue = '\x1b[34m';
const white = '\x1b[97m';
const levels: Record<number, [string, string]> = {
  10: ['TRACE', '\x1b[90m'],
  20: ['DEBUG', '\x1b[90m'],
  30: ['INFO', '\x1b[32m'],
  40: ['WARN', '\x1b[33m'],
  50: ['ERROR', '\x1b[31m'],
  60: ['FATAL', '\x1b[31;1m'],
};

function displayLog(line: string): string {
  const start = line.indexOf('{"level":');
  if (start < 0) return line;
  try {
    const entry = JSON.parse(line.slice(start)) as Record<string, unknown>;
    const level = levels[Number(entry.level)];
    if (!level) return line;
    const time =
      typeof entry.time === 'number'
        ? new Date(entry.time).toLocaleString('en-GB', { hour12: false })
        : '';
    const fields = Object.entries(entry)
      .filter(([key]) => key !== 'level' && key !== 'time')
      .map(([key, value]) => {
        const status = Number(value);
        const valueColor =
          key === 'status'
            ? status >= 500
              ? '\x1b[31m'
              : status >= 400
                ? '\x1b[33m'
                : '\x1b[32m'
            : key === 'path'
              ? blue
              : key === 'method' || key === 'msg'
                ? white
                : dim;
        return `${cyan}${key}${reset}=${valueColor}${JSON.stringify(value)}${reset}`;
      });
    return `${line.slice(0, start)}${dim}${time}${reset} ${level[1]}${level[0]}${reset} ${fields.join(' ')}`;
  } catch {
    return line;
  }
}

async function forwardOutput(
  stream: ReadableStream<Uint8Array>,
  output: { write(chunk: string): unknown },
): Promise<void> {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let pending = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    pending += decoder.decode(value, { stream: true });
    const lines = pending.split('\n');
    pending = lines.pop() ?? '';
    for (const line of lines) output.write(`${displayLog(line)}\n`);
  }
  pending += decoder.decode();
  if (pending) output.write(displayLog(pending));
}

const portsPath = '.env.ports';
const localEnv = (await Bun.file('.env.local').exists())
  ? await Bun.file('.env.local').text()
  : '';
const caddyPort = parsePort(process.env.CADDY_HTTP_PORT) ?? 80;
const portsFile = Bun.file(portsPath);
const previous = (await portsFile.exists()) ? await portsFile.text() : '';
if (!(await Bun.file('.env').exists())) {
  throw new Error(
    'Missing .env. Copy .env.example and set BETTER_AUTH_SECRET first.',
  );
}

async function compose(
  args: string[],
  ports?: { API_DEV_PORT: number; WEB_DEV_PORT: number },
): Promise<void> {
  const command = ['docker', 'compose', ...args];
  const run = Bun.spawn(command, {
    env: ports
      ? {
          ...process.env,
          API_DEV_PORT: String(ports.API_DEV_PORT),
          WEB_DEV_PORT: String(ports.WEB_DEV_PORT),
        }
      : process.env,
    stdin: 'inherit',
    stdout: 'inherit',
    stderr: 'inherit',
  });
  if ((await run.exited) !== 0) {
    throw new Error(`Docker Compose failed: ${args.join(' ')}`);
  }
}

async function responds(
  port: number,
  path: string,
  host?: string,
): Promise<boolean> {
  try {
    const response = await fetch(`http://127.0.0.1:${port}${path}`, {
      headers: host ? { host } : undefined,
      signal: AbortSignal.timeout(1_000),
    });
    return response.ok;
  } catch {
    return false;
  }
}

// Dependencies can already be running. Do not recreate Caddy until both new
// development servers are accepting requests.
await compose(['up', '-d', 'postgres', 'mailpit']);
// Create the database if needed, apply migrations (pgvector included), and
// prepare the pg-boss schema before any server connects.
const ensureDb = Bun.spawn([process.execPath, 'run', 'db:ensure'], {
  stdin: 'inherit',
  stdout: 'inherit',
  stderr: 'inherit',
});
if ((await ensureDb.exited) !== 0) {
  throw new Error('Could not prepare the local database (bun run db:ensure)');
}
const apiReservation = reservePort(parsePort(process.env.PORT));
const webReservation = reservePort(
  savedPort(localEnv, 'WEB_DEV_PORT') ?? parsePort(process.env.WEB_DEV_PORT),
);
const apiPort = apiReservation.port;
const webPort = webReservation.port;
apiReservation.stop(true);
webReservation.stop(true);
if (!apiPort || !webPort)
  throw new Error('Could not reserve development ports');

process.stdout.write(`Starting API on ${apiPort} and web on ${webPort}...\n`);
const child = Bun.spawn([process.execPath, 'run', 'turbo', 'dev', '--color'], {
  env: {
    ...process.env,
    PORT: String(apiPort),
    WEB_DEV_PORT: String(webPort),
    FORCE_COLOR: '1',
  },
  stdin: 'inherit',
  stdout: 'pipe',
  stderr: 'pipe',
});
const outputTasks = [
  forwardOutput(child.stdout, process.stdout),
  forwardOutput(child.stderr, process.stderr),
];
let stopping = false;
let interrupted = false;
function stopChild() {
  if (stopping || child.exitCode !== null) return;
  stopping = true;
  if (process.platform === 'win32') {
    // Turbo has descendants. Killing only its wrapper leaves Bun/Vite behind.
    Bun.spawnSync(['taskkill', '/PID', String(child.pid), '/T', '/F'], {
      stdout: 'ignore',
      stderr: 'ignore',
    });
  } else {
    child.kill('SIGTERM');
  }
}
function onStop() {
  interrupted = true;
  stopChild();
}
process.on('SIGINT', onStop);
process.on('SIGTERM', onStop);

const envFiles = [
  '--env-file',
  '.env',
  ...(localEnv ? ['--env-file', '.env.local'] : []),
  '--env-file',
  portsPath,
];
let published = false;
try {
  const deadline = Date.now() + 60_000;
  while (Date.now() < deadline) {
    if (child.exitCode !== null) {
      throw new Error(
        `Development servers stopped before becoming ready (${child.exitCode})`,
      );
    }
    const [apiReady, webReady] = await Promise.all([
      responds(apiPort, '/openapi.json'),
      responds(webPort, '/'),
    ]);
    if (apiReady && webReady) break;
    await Bun.sleep(250);
  }
  if (
    !(await responds(apiPort, '/openapi.json')) ||
    !(await responds(webPort, '/'))
  ) {
    throw new Error('Timed out waiting for the API and web servers');
  }

  await Bun.write(
    portsPath,
    withDevPorts(previous, {
      API_DEV_PORT: apiPort,
      WEB_DEV_PORT: webPort,
    }),
  );
  try {
    await compose([...envFiles, 'up', '-d', '--no-deps', 'caddy'], {
      API_DEV_PORT: apiPort,
      WEB_DEV_PORT: webPort,
    });
  } catch (error) {
    await Bun.write(portsPath, previous);
    throw error;
  }
  published = true;
  process.stdout.write(
    'Caddy now routes http://orchestrateur-pharmafield.localhost and http://api.orchestrateur-pharmafield.localhost to this dev run.\n',
  );
  if (process.argv.includes('--smoke')) {
    const deadline = Date.now() + 10_000;
    while (Date.now() < deadline) {
      const [apiReady, webReady] = await Promise.all([
        responds(
          caddyPort,
          '/openapi.json',
          'api.orchestrateur-pharmafield.localhost',
        ),
        responds(caddyPort, '/', 'orchestrateur-pharmafield.localhost'),
      ]);
      if (apiReady && webReady) break;
      await Bun.sleep(250);
    }
    if (
      !(await responds(
        caddyPort,
        '/openapi.json',
        'api.orchestrateur-pharmafield.localhost',
      )) ||
      !(await responds(caddyPort, '/', 'orchestrateur-pharmafield.localhost'))
    ) {
      throw new Error('Caddy did not reach both development servers');
    }
    process.stdout.write('Verified both development routes through Caddy.\n');
  } else {
    const exitCode = await child.exited;
    process.exitCode = interrupted ? 0 : exitCode;
  }
} catch (error) {
  process.stderr.write(
    `${error instanceof Error ? error.message : String(error)}\n`,
  );
  process.exitCode = interrupted ? 0 : 1;
} finally {
  stopChild();
  await child.exited;
  await Promise.all(outputTasks);
  process.off('SIGINT', onStop);
  process.off('SIGTERM', onStop);
  const oldApi =
    savedPort(previous, 'API_DEV_PORT') ?? parsePort(process.env.PORT);
  const oldWeb =
    savedPort(previous, 'WEB_DEV_PORT') ?? savedPort(localEnv, 'WEB_DEV_PORT');
  if (
    published &&
    oldApi &&
    oldWeb &&
    (await responds(oldApi, '/openapi.json')) &&
    (await responds(oldWeb, '/'))
  ) {
    try {
      await Bun.write(portsPath, previous);
      await compose([...envFiles, 'up', '-d', '--no-deps', 'caddy'], {
        API_DEV_PORT: oldApi,
        WEB_DEV_PORT: oldWeb,
      });
      process.stdout.write(
        'Restored Caddy to the previous running dev servers.\n',
      );
    } catch {
      process.stderr.write(
        'Could not restore the previous Caddy target. Run make up after resolving Docker Compose.\n',
      );
    }
  }
}
