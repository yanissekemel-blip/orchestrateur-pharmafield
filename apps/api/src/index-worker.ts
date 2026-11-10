import { createWorkerBoss } from './jobs/boss';
import { safeError } from './lib/log-error';
import { logger } from './lib/logger';

const boss = createWorkerBoss();

// Register domain job handlers from `src/modules/<domain>/*.jobs.ts` here,
// after `boss.start()`: `await boss.createQueue(name)` then `boss.work(...)`.
async function main(): Promise<void> {
  await boss.start();
  logger.info('Worker started');
}

let stopping = false;
async function shutdown(signal: string): Promise<void> {
  if (stopping) return;
  stopping = true;
  logger.info({ signal }, 'Worker stopping');
  await boss.stop({ graceful: true });
  process.exit(0);
}

process.on('SIGINT', () => void shutdown('SIGINT'));
process.on('SIGTERM', () => void shutdown('SIGTERM'));

main().catch((error) => {
  logger.error(safeError(error), 'Worker failed to start');
  process.exit(1);
});
