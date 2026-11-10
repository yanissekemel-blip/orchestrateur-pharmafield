import { date, time, timestamp } from 'drizzle-orm/pg-core';

// A calendar date has no time zone or time of day. Keep it as YYYY-MM-DD.
export function calendarDate(name: string) {
  return date(name, { mode: 'string' });
}

// An instant has millisecond precision, independent of the database session zone.
export function utcTimestamp(name: string) {
  return timestamp(name, { withTimezone: true, precision: 3, mode: 'date' });
}

// A wall-clock time has no date or time zone. Store a zone separately if needed.
export function wallClockTime(name: string) {
  return time(name, { withTimezone: false, precision: 0 });
}
