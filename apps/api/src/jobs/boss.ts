import { sql } from 'drizzle-orm';
import { type DrizzleTransactionLike, fromDrizzle, PgBoss } from 'pg-boss';
import { env } from '../lib/env';
import { safeError } from '../lib/log-error';
import { logger } from '../lib/logger';

// pg-boss keeps its queues in the `pgboss` schema of the application database
// and migrates that schema itself on start (see `schemaFilter` in
// drizzle.config.ts).
function createBoss(options: { maintenance: boolean }): PgBoss {
  const boss = new PgBoss({
    connectionString: env.DATABASE_URL,
    // Only the worker runs queue maintenance and cron scheduling.
    supervise: options.maintenance,
    schedule: options.maintenance,
  });
  boss.on('error', (error) => {
    logger.error(safeError(error), 'pg-boss error');
  });
  return boss;
}

let producer: Promise<PgBoss> | undefined;

/**
 * The API's pg-boss instance, started on first use. It only sends jobs; the
 * worker entrypoint processes them. Create a queue (`boss.createQueue`) before
 * sending to it.
 */
export function getBoss(): Promise<PgBoss> {
  producer ??= createBoss({ maintenance: false })
    .start()
    .catch((error: unknown) => {
      producer = undefined;
      throw error;
    });
  return producer;
}

/** The worker's pg-boss instance, which also runs maintenance and cron. */
export function createWorkerBoss(): PgBoss {
  return createBoss({ maintenance: true });
}

/**
 * Runs a pg-boss call inside a Drizzle transaction, so the job is created only
 * if the transaction commits:
 *
 * ```ts
 * await db.transaction(async (tx) => {
 *   await tx.insert(orders).values(order);
 *   await (await getBoss()).send('order.created', { orderId }, { db: jobDb(tx) });
 * });
 * ```
 */
export function jobDb(tx: DrizzleTransactionLike) {
  return fromDrizzle(tx, sql);
}
