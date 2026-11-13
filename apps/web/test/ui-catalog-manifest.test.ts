import { describe, expect, it } from 'vitest';
import { dataGroups } from '../src/routes/ui/-components/data';
import { formGroups } from '../src/routes/ui/-components/forms';
import { foundationGroups } from '../src/routes/ui/-components/foundations';
import { navigationGroups } from '../src/routes/ui/-components/navigation';
import { overlayGroups } from '../src/routes/ui/-components/overlays';
import { recordGroups } from '../src/routes/ui/-components/records';
import { scheduleGroups } from '../src/routes/ui/-components/schedules';

const groups = [
  ...foundationGroups,
  ...navigationGroups,
  ...formGroups,
  ...scheduleGroups,
  ...overlayGroups,
  ...dataGroups,
  ...recordGroups,
];

describe('component catalog coverage', () => {
  it('assigns each component family to exactly one example and section', () => {
    const sections = groups.map((group) => group.id);
    const items = groups.flatMap((group) => group.items);
    const examples = items.map((item) => item.id);
    expect(new Set(sections).size).toBe(sections.length);
    expect(new Set(examples).size).toBe(examples.length);
    expect(new Set(items.map((item) => item.name.toLowerCase())).size).toBe(
      items.length,
    );
    expect(examples.length).toBeGreaterThanOrEqual(60);
    expect(examples).toEqual(
      expect.arrayContaining([
        'button',
        'sidebar',
        'form',
        'calendar',
        'range-calendar-with-presets',
        'rich-text-editor',
        'dialog',
        'confirm-modal',
        'settings-modal',
        'sonner',
        'charts',
        'table',
        'metric-strip',
      ]),
    );
  });
});
