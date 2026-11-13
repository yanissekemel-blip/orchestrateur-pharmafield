'use client';

import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from 'lucide-react';
import * as React from 'react';
import {
  type DayButton,
  DayPicker,
  getDefaultClassNames,
} from 'react-day-picker';
import { fr } from 'react-day-picker/locale';
import { Button, buttonVariants } from './button';
import { cn } from './utils';

const shortMonthFormatter = new Intl.DateTimeFormat('fr-FR', {
  month: 'short',
  timeZone: 'UTC',
});

function toUtcCivilDate(date: Date) {
  return new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  );
}

function formatCivilDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function CalendarRoot({
  className,
  rootRef,
  ...props
}: React.ComponentProps<'div'> & {
  rootRef?: React.Ref<HTMLDivElement>;
}) {
  return (
    <div
      data-slot="calendar"
      ref={rootRef}
      className={cn(className)}
      {...props}
    />
  );
}

function CalendarChevron({
  className,
  orientation,
  ...props
}: React.ComponentProps<'svg'> & {
  orientation?: 'left' | 'right' | 'up' | 'down';
}) {
  if (orientation === 'left') {
    return <ChevronLeftIcon className={cn('size-4', className)} {...props} />;
  }

  if (orientation === 'right') {
    return <ChevronRightIcon className={cn('size-4', className)} {...props} />;
  }

  return <ChevronDownIcon className={cn('size-4', className)} {...props} />;
}

function CalendarWeekNumber({
  children,
  ...props
}: React.ComponentProps<'td'>) {
  return (
    <td {...props}>
      <div className="flex size-(--cell-size) items-center justify-center text-center">
        {children}
      </div>
    </td>
  );
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = 'label',
  buttonVariant = 'ghost',
  locale = fr,
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>['variant'];
}) {
  const defaultClassNames = getDefaultClassNames();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        'group/calendar bg-transparent p-3 text-[var(--ink)] [--cell-size:--spacing(8)]',
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className,
      )}
      captionLayout={captionLayout}
      locale={locale}
      formatters={{
        formatMonthDropdown: (date) =>
          shortMonthFormatter.format(toUtcCivilDate(date)),
        ...formatters,
      }}
      classNames={{
        root: cn('w-fit', defaultClassNames.root),
        months: cn(
          'flex gap-4 flex-col md:flex-row relative',
          defaultClassNames.months,
        ),
        month: cn('flex flex-col w-full gap-4', defaultClassNames.month),
        nav: cn(
          'flex items-center gap-1 w-full absolute top-0 inset-x-0 justify-between',
          defaultClassNames.nav,
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          'size-(--cell-size) rounded-[var(--radius-control)] p-0 text-[var(--ink-2)] select-none aria-disabled:opacity-50',
          defaultClassNames.button_previous,
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          'size-(--cell-size) rounded-[var(--radius-control)] p-0 text-[var(--ink-2)] select-none aria-disabled:opacity-50',
          defaultClassNames.button_next,
        ),
        month_caption: cn(
          'flex items-center justify-center h-(--cell-size) w-full px-(--cell-size)',
          defaultClassNames.month_caption,
        ),
        dropdowns: cn(
          'w-full flex items-center text-[13.5px] font-heading justify-center h-(--cell-size) gap-1.5',
          defaultClassNames.dropdowns,
        ),
        dropdown_root: cn(
          'relative rounded-[var(--radius-control)] has-focus:shadow-[var(--focus-ring)]',
          defaultClassNames.dropdown_root,
        ),
        dropdown: cn(
          'absolute bg-white inset-0 opacity-0',
          defaultClassNames.dropdown,
        ),
        caption_label: cn(
          'select-none font-heading text-[var(--ink)]',
          captionLayout === 'label'
            ? 'text-[13.5px]'
            : 'rounded-[var(--radius-control)] pl-2.5 pr-1.5 flex items-center gap-1 text-[13px] h-8 hover:bg-[var(--charcoal-a06)] [&>svg]:text-[var(--ink-3)] [&>svg]:size-3.5',
          defaultClassNames.caption_label,
        ),
        month_grid: 'w-full border-collapse',
        weekdays: cn('flex', defaultClassNames.weekdays),
        weekday: cn(
          'flex-1 text-[11.5px] font-semibold text-[var(--ink-3)] select-none',
          defaultClassNames.weekday,
        ),
        week: cn('flex w-full mt-2', defaultClassNames.week),
        week_number_header: cn(
          'select-none w-(--cell-size)',
          defaultClassNames.week_number_header,
        ),
        week_number: cn(
          'text-[10.5px] font-semibold select-none text-[var(--ink-3)]',
          defaultClassNames.week_number,
        ),
        day: cn(
          'relative w-full h-full p-0 text-center [&:last-child[data-selected=true]_button]:rounded-r-[var(--radius-control)] group/day aspect-square select-none',
          props.showWeekNumber
            ? '[&:nth-child(2)[data-selected=true]_button]:rounded-l-[var(--radius-control)]'
            : '[&:first-child[data-selected=true]_button]:rounded-l-[var(--radius-control)]',
          defaultClassNames.day,
        ),
        range_start: cn(
          'rounded-l-[var(--radius-control)] bg-[var(--accent-soft)]',
          defaultClassNames.range_start,
        ),
        range_middle: cn('rounded-none', defaultClassNames.range_middle),
        range_end: cn(
          'rounded-r-[var(--radius-control)] bg-[var(--accent-soft)]',
          defaultClassNames.range_end,
        ),
        today: cn('rounded-[var(--radius-control)]', defaultClassNames.today),
        outside: cn(
          'text-[var(--ink-3)] aria-selected:text-[var(--ink-3)]',
          defaultClassNames.outside,
        ),
        disabled: cn(
          'text-[var(--ink-3)] opacity-50',
          defaultClassNames.disabled,
        ),
        hidden: cn('invisible', defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: CalendarRoot,
        Chevron: CalendarChevron,
        DayButton: CalendarDayButton,
        WeekNumber: CalendarWeekNumber,
        ...components,
      }}
      {...props}
    />
  );
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames();

  const ref = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={formatCivilDate(day.date)}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      data-today={modifiers.today}
      className={cn(
        'flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 rounded-[var(--radius-control)] text-[12px] leading-none font-semibold text-[var(--ink)] hover:bg-[var(--charcoal-a06)] data-[today=true]:font-extrabold data-[today=true]:ring-[1.5px] data-[today=true]:ring-[var(--ink)] data-[today=true]:ring-inset data-[selected-single=true]:!bg-[var(--accent)] data-[selected-single=true]:font-extrabold data-[selected-single=true]:!text-white data-[range-start=true]:rounded-[var(--radius-control)] data-[range-start=true]:!bg-[var(--accent)] data-[range-start=true]:font-extrabold data-[range-start=true]:!text-white data-[range-end=true]:rounded-[var(--radius-control)] data-[range-end=true]:!bg-[var(--accent)] data-[range-end=true]:font-extrabold data-[range-end=true]:!text-white data-[range-middle=true]:rounded-none data-[range-middle=true]:bg-[var(--accent-soft)] data-[range-middle=true]:text-[var(--ink)] data-[range-middle=true]:hover:bg-[var(--charcoal-a10)] [&>span]:text-xs [&>span]:opacity-70',
        defaultClassNames.day,
        className,
      )}
      {...props}
    />
  );
}

export { Calendar, CalendarDayButton };
