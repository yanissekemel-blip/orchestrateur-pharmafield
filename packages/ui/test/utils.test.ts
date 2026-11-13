import { describe, expect, test } from 'bun:test';
import { cn } from '../src/lib/utils';

describe('cn', () => {
  test('merges conflicting Tailwind classes', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4');
  });
});
