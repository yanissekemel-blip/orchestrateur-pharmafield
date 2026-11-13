'use client';

import {
  CheckIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  CircleIcon,
} from 'lucide-react';
import { Menubar as MenubarPrimitive } from 'radix-ui';
import type * as React from 'react';

import { cn } from './utils';

function Menubar({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Root>) {
  return (
    <MenubarPrimitive.Root
      data-slot="menubar"
      className={cn(
        'flex h-9 items-center gap-0.5 rounded-[var(--radius-control)] bg-[var(--charcoal-a06)] p-[3px]',
        className,
      )}
      {...props}
    />
  );
}

function MenubarMenu({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Menu>) {
  return <MenubarPrimitive.Menu data-slot="menubar-menu" {...props} />;
}

function MenubarGroup({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Group>) {
  return <MenubarPrimitive.Group data-slot="menubar-group" {...props} />;
}

function MenubarPortal({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Portal>) {
  return <MenubarPrimitive.Portal data-slot="menubar-portal" {...props} />;
}

function MenubarRadioGroup({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.RadioGroup>) {
  return (
    <MenubarPrimitive.RadioGroup data-slot="menubar-radio-group" {...props} />
  );
}

function MenubarTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Trigger>) {
  return (
    <MenubarPrimitive.Trigger
      data-slot="menubar-trigger"
      className={cn(
        'flex h-[30px] items-center gap-1.5 rounded-[var(--radius-control)] px-3.5 text-[12px] font-bold text-[var(--ink-2)] outline-hidden select-none transition-[background-color,color,box-shadow] duration-150 ease-out focus-visible:shadow-[var(--focus-ring)] data-[state=open]:bg-white data-[state=open]:text-[var(--ink)] data-[state=open]:shadow-[var(--shadow-raised)] motion-reduce:transition-none',
        className,
      )}
      {...props}
    >
      {children}
      <span aria-hidden="true" className="flex items-center">
        <ChevronDownIcon className="size-3 text-[var(--ink-3)]" />
      </span>
    </MenubarPrimitive.Trigger>
  );
}

function MenubarContent({
  className,
  align = 'start',
  alignOffset = -4,
  sideOffset = 8,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Content>) {
  return (
    <MenubarPortal>
      <MenubarPrimitive.Content
        data-slot="menubar-content"
        align={align}
        alignOffset={alignOffset}
        sideOffset={sideOffset}
        className={cn(
          'z-50 max-h-[min(20rem,var(--radix-menubar-content-available-height))] min-w-[12rem] origin-(--radix-menubar-content-transform-origin) overflow-x-hidden overflow-y-auto text-[var(--ink)] motion-reduce:animate-none',
          className,
        )}
        {...props}
      />
    </MenubarPortal>
  );
}

function MenubarItem({
  className,
  inset,
  variant = 'default',
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Item> & {
  inset?: boolean;
  variant?: 'default' | 'destructive';
}) {
  return (
    <MenubarPrimitive.Item
      data-slot="menubar-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        "relative flex min-h-8 cursor-pointer items-center gap-2 rounded-[var(--radius-control)] py-1.5 text-[12.5px] font-semibold text-[var(--ink)] px-2.5 data-[inset]:pl-8 outline-hidden select-none transition-[background-color,color] duration-150 ease-out focus:bg-[var(--charcoal-a06)] data-[disabled]:pointer-events-none data-[disabled]:opacity-50 motion-reduce:transition-none motion-reduce:transform-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='text-'])]:text-[var(--ink-3)] [&_svg:not([class*='size-'])]:size-4 data-[variant=destructive]:text-[var(--bad)] data-[variant=destructive]:focus:bg-[var(--bad-soft)] data-[variant=destructive]:focus:text-[var(--bad)] data-[variant=destructive]:*:[svg]:!text-[var(--bad)]",
        className,
      )}
      {...props}
    />
  );
}

function MenubarCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.CheckboxItem>) {
  return (
    <MenubarPrimitive.CheckboxItem
      data-slot="menubar-checkbox-item"
      className={cn(
        "relative flex min-h-8 cursor-pointer items-center gap-2 rounded-[var(--radius-control)] py-1.5 text-[12.5px] font-semibold text-[var(--ink)] pr-2.5 pl-8 outline-hidden select-none transition-[background-color,color] duration-150 ease-out focus:bg-[var(--charcoal-a06)] data-[disabled]:pointer-events-none data-[disabled]:opacity-50 motion-reduce:transition-none motion-reduce:transform-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='text-'])]:text-[var(--ink-3)] [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      checked={checked}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <MenubarPrimitive.ItemIndicator>
          <CheckIcon className="size-4 text-[var(--accent)]" />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.CheckboxItem>
  );
}

function MenubarRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.RadioItem>) {
  return (
    <MenubarPrimitive.RadioItem
      data-slot="menubar-radio-item"
      className={cn(
        "relative flex min-h-8 cursor-pointer items-center gap-2 rounded-[var(--radius-control)] py-1.5 text-[12.5px] font-semibold text-[var(--ink)] pr-2.5 pl-8 outline-hidden select-none transition-[background-color,color] duration-150 ease-out focus:bg-[var(--charcoal-a06)] data-[disabled]:pointer-events-none data-[disabled]:opacity-50 motion-reduce:transition-none motion-reduce:transform-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='text-'])]:text-[var(--ink-3)] [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <MenubarPrimitive.ItemIndicator>
          <CircleIcon className="size-2 fill-current text-[var(--accent)]" />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.RadioItem>
  );
}

function MenubarLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Label> & {
  inset?: boolean;
}) {
  return (
    <MenubarPrimitive.Label
      data-slot="menubar-label"
      data-inset={inset}
      className={cn(
        'px-2.5 py-1.5 text-[12px] font-label text-[var(--ink-3)] data-[inset]:pl-8',
        className,
      )}
      {...props}
    />
  );
}

function MenubarSeparator({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Separator>) {
  return (
    <MenubarPrimitive.Separator
      data-slot="menubar-separator"
      className={cn('-mx-1 my-1 h-px bg-[var(--charcoal-a07)]', className)}
      {...props}
    />
  );
}

function MenubarShortcut({
  className,
  ...props
}: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="menubar-shortcut"
      className={cn(
        'ml-auto font-mono text-[10.5px] tracking-normal text-[var(--ink-3)]',
        className,
      )}
      {...props}
    />
  );
}

function MenubarSub({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Sub>) {
  return <MenubarPrimitive.Sub data-slot="menubar-sub" {...props} />;
}

function MenubarSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.SubTrigger> & {
  inset?: boolean;
}) {
  return (
    <MenubarPrimitive.SubTrigger
      data-slot="menubar-sub-trigger"
      data-inset={inset}
      className={cn(
        "relative flex min-h-8 cursor-pointer items-center gap-2 rounded-[var(--radius-control)] py-1.5 text-[12.5px] font-semibold text-[var(--ink)] px-2.5 data-[inset]:pl-8 data-[state=open]:bg-[var(--charcoal-a06)] outline-hidden select-none transition-[background-color,color] duration-150 ease-out focus:bg-[var(--charcoal-a06)] data-[disabled]:pointer-events-none data-[disabled]:opacity-50 motion-reduce:transition-none motion-reduce:transform-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='text-'])]:text-[var(--ink-3)] [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto h-4 w-4" />
    </MenubarPrimitive.SubTrigger>
  );
}

function MenubarSubContent({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.SubContent>) {
  return (
    <MenubarPrimitive.SubContent
      data-slot="menubar-sub-content"
      className={cn(
        'z-50 max-h-[min(20rem,var(--radix-menubar-content-available-height))] min-w-[10rem] origin-(--radix-menubar-content-transform-origin) overflow-x-hidden overflow-y-auto text-[var(--ink)] motion-reduce:animate-none',
        className,
      )}
      {...props}
    />
  );
}

export {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarPortal,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
};
