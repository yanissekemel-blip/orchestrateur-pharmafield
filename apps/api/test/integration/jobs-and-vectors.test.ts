import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import { cosineDistance, sql } from 'drizzle-orm';
import { integer, pgTable, vector } from 'drizzle-orm/pg-core';
import type { PgBoss } from 'pg-boss';
import { db, pool } from '../../src/db/client';
import { getBoss, jobDb } from '../../src/jobs/boss';

// Requires `make deps` and `bun run db:migrate`.
const queue = `integration-${crypto.randomUUID()}`;
let boss: PgBoss;

beforeAll(async () => {
  boss = await getBoss();
  await boss.createQueue(queue);
});

afterAll(async () => {
  await boss.deleteQueue(queue);
  await boss.stop({ graceful: false });
  await pool.end();
});

describe('pg-boss jobs in Drizzle transactions', () => {
  test('a committed transaction creates the job', async () => {
    const id = await db.transaction((tx) =>
      boss.send(queue, { step: 'commit' }, { db: jobDb(tx) }),
    );
    expect(id).toBeString();
    expect(await boss.getJobById(queue, id as string)).not.toBeNull();
  });

  test('a rolled-back transaction leaves no job', async () => {
    let id: string | null = null;
    const rollback = new Error('rollback');
    await expect(
      db.transaction(async (tx) => {
        id = await boss.send(queue, { step: 'rollback' }, { db: jobDb(tx) });
        throw rollback;
      }),
    ).rejects.toBe(rollback);
    expect(id).toBeString();
    expect(await boss.getJobById(queue, id as unknown as string)).toBeNull();
  });
});

describe('pgvector', () => {
  test('orders rows by cosine distance', async () => {
    // A per-transaction temp table: nothing is left in the database.
    const items = pgTable('vector_items', {
      id: integer('id').primaryKey(),
      embedding: vector('embedding', { dimensions: 3 }),
    });
    const ids = await db.transaction(async (tx) => {
      await tx.execute(
        sql`CREATE TEMP TABLE vector_items (id integer PRIMARY KEY, embedding vector(3)) ON COMMIT DROP`,
      );
      await tx.insert(items).values([
        { id: 1, embedding: [1, 0, 0] },
        { id: 2, embedding: [0, 1, 0] },
        { id: 3, embedding: [0.9, 0.1, 0] },
      ]);
      const rows = await tx
        .select({ id: items.id })
        .from(items)
        .orderBy(cosineDistance(items.embedding, [1, 0, 0]));
      return rows.map((row) => row.id);
    });
    expect(ids).toEqual([1, 3, 2]);
  });
});
