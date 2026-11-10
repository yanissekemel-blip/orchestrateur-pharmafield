import { parsePort, reservePort, savedPort, withDevPorts } from './dev-ports';

const filePath = '.env.local';
const file = Bun.file(filePath);
const current = (await file.exists()) ? await file.text() : '';
const existing = savedPort(current, 'WEB_DEV_PORT');
const renew = process.argv.includes('--renew');
let port = existing;

if (!port || renew) {
  const server = reservePort();
  port = server.port;
  server.stop(true);
  if (!port) throw new Error('Could not find a free web port');
  const updated = /^WEB_DEV_PORT=.*$/m.test(current)
    ? current.replace(/^WEB_DEV_PORT=.*$/m, `WEB_DEV_PORT=${port}`)
    : `${current.trimEnd()}${current.trim() ? '\n' : ''}WEB_DEV_PORT=${port}\n`;
  await Bun.write(filePath, updated);
  process.stdout.write(`Local web port: ${port} (saved in ${filePath})\n`);
} else {
  process.stdout.write(`Keeping web port: ${port}\n`);
}

const portsPath = '.env.ports';
const portsFile = Bun.file(portsPath);
const wasSaved = await portsFile.exists();
if (!wasSaved || renew) {
  const previous = wasSaved ? await portsFile.text() : '';
  await Bun.write(
    portsPath,
    withDevPorts(previous, {
      API_DEV_PORT:
        savedPort(previous, 'API_DEV_PORT') ??
        parsePort(process.env.PORT) ??
        3000,
      WEB_DEV_PORT: port,
    }),
  );
}
