'use client';

import { Check, ChevronsUpDown } from 'lucide-react';
import { type ReactNode, useMemo, useState } from 'react';
import { Button } from './button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './command';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { cn } from './utils';

function buildTimezoneOptions() {
  return Intl.supportedValuesOf('timeZone')
    .map((value) => {
      const parts = value.split('/');
      const city = parts.at(-1)?.replaceAll('_', ' ') ?? value;
      return { value, label: `${city} (${parts[0] ?? 'UTC'})` };
    })
    .sort((left, right) => left.label.localeCompare(right.label, 'fr'));
}

export function TimezoneCombobox({
  value,
  onChange,
  disabled = false,
  icon,
  hint,
  className,
  'aria-label': ariaLabel,
}: {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  /** Leading icon, for toolbars where the field has no visible label. */
  icon?: ReactNode;
  /** Muted text before the chevron, such as the current UTC offset. */
  hint?: ReactNode;
  className?: string;
  'aria-label'?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const options = useMemo(buildTimezoneOptions, []);
  const selected = options.find((option) => option.value === value);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen} modal>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          aria-label={ariaLabel}
          disabled={disabled}
          className={cn(
            'h-9 w-full justify-between gap-2 text-left rounded-[var(--radius-input)] border-[var(--charcoal-a10)] bg-white px-3 text-[12.5px] normal-case tracking-normal [font-stretch:100%] font-normal text-[var(--ink)] shadow-[var(--shadow-input)] hover:bg-white focus-visible:border-transparent data-[state=open]:border-transparent data-[state=open]:shadow-[var(--focus-ring)] active:scale-100 [&_svg:not([class*=text-])]:text-[var(--ink-3)]',
            className,
          )}
        >
          {icon}
          <span className="min-w-0 flex-1 truncate">
            {selected?.label ?? value ?? 'Sélectionner un fuseau horaire'}
          </span>
          {hint ? (
            <span className="shrink-0 text-[11.5px] tabular-nums text-[var(--ink-3)]">
              {hint}
            </span>
          ) : null}
          <ChevronsUpDown className="size-3.5 shrink-0 text-[var(--ink-3)]" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        side="bottom"
        sideOffset={6}
        className="z-[80] w-[min(420px,calc(100vw-3rem))] p-0"
      >
        <Command>
          <CommandInput placeholder="Rechercher un fuseau horaire" />
          <CommandList className="max-h-72 overflow-y-auto">
            <CommandEmpty>Aucun fuseau horaire trouvé.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={`${option.value} ${option.label}`}
                  onSelect={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 size-3.5 stroke-[2.5] text-[var(--accent)]',
                      option.value === value ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  <span className="truncate">{option.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
