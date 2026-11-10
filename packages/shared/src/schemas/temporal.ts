import { z } from '@hono/zod-openapi';

// Calendar dates and wall-clock times have no implicit time zone.
export const calendarDateSchema = z.iso.date(); // YYYY-MM-DD
export const wallClockTimeSchema = z.iso.time({ precision: 0 }); // HH:mm:ss

// Instants are UTC ISO 8601 at millisecond precision (PostgreSQL timestamptz(3)).
export const utcTimestampSchema = z.iso.datetime({
  offset: false,
  precision: 3,
});

export type CalendarDate = z.infer<typeof calendarDateSchema>;
export type WallClockTime = z.infer<typeof wallClockTimeSchema>;
export type UtcTimestamp = z.infer<typeof utcTimestampSchema>;
