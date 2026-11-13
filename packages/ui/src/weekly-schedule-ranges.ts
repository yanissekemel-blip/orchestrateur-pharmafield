/**
 * A weekly time range in wall-clock time (`HH:mm`). A range whose end is at or
 * before its start crosses midnight into the next day; an end of `00:00`
 * means "until midnight", and `00:00–00:00` is a whole day.
 */
export type WeeklyRange = { day: number; start: string; end: string };
export type WeeklyDay = {
  value: number;
  label: string;
  short: string;
  /** Tints the day's column slightly to set the weekend apart. */
  weekend?: boolean;
};

export const DAY_MINUTES = 1440;

export const toMinutes = (time: string) => {
  const [hours = 0, minutes = 0] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

/** `HH:mm` for a minute of the day; 1440 wraps to `00:00`. */
export const formatMinutes = (minutes: number) => {
  const value = ((minutes % DAY_MINUTES) + DAY_MINUTES) % DAY_MINUTES;
  return `${String(Math.floor(value / 60)).padStart(2, '0')}:${String(value % 60).padStart(2, '0')}`;
};

export const shownEnd = (end: string) => (end === '00:00' ? '24:00' : end);

/** One range's visible stretch within a day, in minutes from midnight. */
export type DaySegment = { index: number; start: number; end: number };

/**
 * The stretch the range at `active` would merge into on this day, with every
 * range it overlaps or touches, directly or through another range. Returns
 * null when the active range stands alone.
 */
export function mergePreview(segments: readonly DaySegment[], active: number) {
  const group = segments.filter((segment) => segment.index === active);
  if (group.length === 0) return null;
  let start = Math.min(...group.map((segment) => segment.start));
  let end = Math.max(...group.map((segment) => segment.end));
  let grew = true;
  while (grew) {
    grew = false;
    for (const segment of segments) {
      if (group.includes(segment)) continue;
      if (segment.start > end || segment.end < start) continue;
      group.push(segment);
      start = Math.min(start, segment.start);
      end = Math.max(end, segment.end);
      grew = true;
    }
  }
  if (group.length < 2) return null;
  return {
    start,
    end,
    indexes: new Set(group.map((segment) => segment.index)),
  };
}

export const crossesMidnight = (range: WeeklyRange) =>
  range.end !== '00:00' && toMinutes(range.end) <= toMinutes(range.start);

/** Length of a range in minutes, overnight continuation included. */
const rangeLength = (range: WeeklyRange) => {
  const start = toMinutes(range.start);
  const end = range.end === '00:00' ? DAY_MINUTES : toMinutes(range.end);
  return end > start ? end - start : DAY_MINUTES - start + end;
};

/**
 * Merges ranges that overlap or touch, including overnight tails reaching
 * into the next day and Sunday into Monday. A merged stretch longer than a
 * day is split at midnight so every range stays expressible.
 */
export function mergeWeeklyRanges(
  ranges: readonly WeeklyRange[],
  days: readonly WeeklyDay[],
): WeeklyRange[] {
  const week = days.length * DAY_MINUTES;
  if (week === 0) return [];
  const position = (day: number) =>
    days.findIndex((candidate) => candidate.value === day);
  const covered = new Uint8Array(week);
  for (const range of ranges) {
    const index = position(range.day);
    if (index < 0) continue;
    const from = index * DAY_MINUTES + toMinutes(range.start);
    const length = rangeLength(range);
    for (let minute = 0; minute < length; minute++)
      covered[(from + minute) % week] = 1;
  }
  const result: WeeklyRange[] = [];
  const emit = (from: number, length: number) => {
    let start = from;
    let left = length;
    while (left > 0) {
      const dayIndex = Math.floor((start % week) / DAY_MINUTES);
      const startMinute = start % DAY_MINUTES;
      const day = days[dayIndex]?.value ?? 0;
      // Fits the day, or crosses one midnight while staying under 24 hours.
      if (startMinute + left <= DAY_MINUTES || left < DAY_MINUTES) {
        result.push({
          day,
          start: formatMinutes(startMinute),
          end: formatMinutes(startMinute + left),
        });
        return;
      }
      const piece = DAY_MINUTES - startMinute;
      result.push({ day, start: formatMinutes(startMinute), end: '00:00' });
      start += piece;
      left -= piece;
    }
  };
  // Start scanning just after a gap so a run wrapping past the week's end
  // stays one run.
  const gap = covered.indexOf(0);
  if (gap < 0) {
    emit(0, week);
  } else {
    let runStart = -1;
    for (let step = 1; step <= week; step++) {
      const minute = (gap + step) % week;
      if (covered[minute] && runStart < 0) runStart = gap + step;
      if (!covered[minute] && runStart >= 0) {
        emit(runStart % week, gap + step - runStart);
        runStart = -1;
      }
    }
  }
  return result.sort(
    (left, right) =>
      position(left.day) - position(right.day) ||
      left.start.localeCompare(right.start),
  );
}

/** The default new range on a day: after its last range, or 09:00–17:00. */
export function nextFreeRange(
  ranges: readonly WeeklyRange[],
  day: number,
): WeeklyRange {
  const latest = ranges
    .filter((range) => range.day === day && !crossesMidnight(range))
    .map((range) => toMinutes(shownEnd(range.end)))
    .sort((left, right) => right - left)[0];
  if (latest === undefined || latest >= 23 * 60)
    return { day, start: '09:00', end: '17:00' };
  const start = Math.ceil(latest / 60) * 60;
  return {
    day,
    start: formatMinutes(start),
    end: formatMinutes(Math.min(start + 60, DAY_MINUTES)),
  };
}
