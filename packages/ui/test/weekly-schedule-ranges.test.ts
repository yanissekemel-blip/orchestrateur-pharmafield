import { describe, expect, test } from 'bun:test';
import { mergePreview, mergeWeeklyRanges } from '../src/weekly-schedule-ranges';

const days = [1, 2, 3, 4, 5, 6, 7].map((value) => ({
  value,
  label: String(value),
  short: String(value),
}));

describe('mergeWeeklyRanges', () => {
  test('merges overlapping and touching ranges on a day', () => {
    expect(
      mergeWeeklyRanges(
        [
          { day: 1, start: '09:00', end: '12:00' },
          { day: 1, start: '11:00', end: '13:00' },
          { day: 1, start: '13:00', end: '14:00' },
          { day: 1, start: '15:00', end: '16:00' },
        ],
        days,
      ),
    ).toEqual([
      { day: 1, start: '09:00', end: '14:00' },
      { day: 1, start: '15:00', end: '16:00' },
    ]);
  });

  test('absorbs a next-day range into an overnight tail', () => {
    expect(
      mergeWeeklyRanges(
        [
          { day: 5, start: '22:00', end: '02:00' },
          { day: 6, start: '01:00', end: '03:00' },
        ],
        days,
      ),
    ).toEqual([{ day: 5, start: '22:00', end: '03:00' }]);
  });

  test('wraps from Sunday into Monday', () => {
    expect(
      mergeWeeklyRanges(
        [
          { day: 7, start: '23:00', end: '00:00' },
          { day: 1, start: '00:00', end: '01:00' },
        ],
        days,
      ),
    ).toEqual([{ day: 7, start: '23:00', end: '01:00' }]);
  });

  test('splits a stretch longer than a day at midnight', () => {
    expect(
      mergeWeeklyRanges(
        [
          { day: 1, start: '20:00', end: '00:00' },
          { day: 2, start: '00:00', end: '00:00' },
        ],
        days,
      ),
    ).toEqual([
      { day: 1, start: '20:00', end: '00:00' },
      { day: 2, start: '00:00', end: '00:00' },
    ]);
  });

  test('keeps a range ending at midnight as is', () => {
    expect(
      mergeWeeklyRanges([{ day: 3, start: '18:00', end: '00:00' }], days),
    ).toEqual([{ day: 3, start: '18:00', end: '00:00' }]);
  });
});

describe('mergePreview', () => {
  const segments = [
    { index: 0, start: 240, end: 690 },
    { index: 1, start: 540, end: 1020 },
    { index: 2, start: 1020, end: 1080 },
    { index: 3, start: 1200, end: 1260 },
  ];

  test('spans every range the active one reaches, through touching ranges', () => {
    const preview = mergePreview(segments, 0);
    expect(preview?.start).toBe(240);
    expect(preview?.end).toBe(1080);
    expect([...(preview?.indexes ?? [])].sort()).toEqual([0, 1, 2]);
  });

  test('returns null when the active range stands alone', () => {
    expect(mergePreview(segments, 3)).toBeNull();
  });

  test('returns null when the active range is not on the day', () => {
    expect(mergePreview(segments, 9)).toBeNull();
  });
});
