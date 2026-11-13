'use client';

import {
  Check,
  ChevronDown,
  ChevronsUpDown,
  type LucideIcon,
} from 'lucide-react';
import { useState } from 'react';
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

type ComboboxOption = {
  value: string;
  label: string;
  prefix?: string;
  disabled?: boolean;
  /** Consecutive options sharing a group render under one section heading. */
  group?: string;
};

function groupOptions(options: ComboboxOption[]) {
  const groups: { heading?: string; options: ComboboxOption[] }[] = [];
  for (const option of options) {
    const last = groups.at(-1);
    if (last && last.heading === option.group) last.options.push(option);
    else groups.push({ heading: option.group, options: [option] });
  }
  return groups;
}

function Combobox({
  options,
  value,
  onValueChange,
  placeholder = 'Sélectionner une option',
  searchPlaceholder = 'Rechercher…',
  emptyMessage = 'Aucun résultat.',
  disabled = false,
  ariaLabel,
  selectedLabel,
  searchValue,
  onSearchValueChange,
  onReachEnd,
  hasMore = false,
  loading = false,
  errorMessage,
  onRetry,
  clearLabel,
  icon: Icon,
  variant = 'default',
  className,
}: {
  options: ComboboxOption[];
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  ariaLabel?: string;
  selectedLabel?: string;
  searchValue?: string;
  onSearchValueChange?: (value: string) => void;
  onReachEnd?: () => void;
  hasMore?: boolean;
  loading?: boolean;
  errorMessage?: string;
  onRetry?: () => void;
  clearLabel?: string;
  icon?: LucideIcon;
  /** `discrete` renders an inline text trigger for compact rows and headers. */
  variant?: 'default' | 'discrete';
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const selected = options.find((option) => option.value === value);
  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-label={ariaLabel}
          aria-expanded={open}
          aria-haspopup="listbox"
          disabled={disabled}
          data-variant={variant}
          className={cn(
            variant === 'discrete'
              ? 'h-7 min-w-0 max-w-full shrink cursor-pointer justify-start gap-1.5 rounded-[var(--radius-control)] bg-transparent px-2 text-[12.5px] font-semibold normal-case tracking-normal [font-stretch:100%] text-[var(--ink)] shadow-none hover:translate-y-0 hover:bg-[var(--charcoal-a06)] data-[state=open]:bg-[var(--charcoal-a06)] active:scale-100 disabled:cursor-not-allowed'
              : 'w-full cursor-pointer justify-between gap-2 rounded-[var(--radius-input)] border-[var(--charcoal-a10)] bg-white px-3 text-[12.5px] normal-case tracking-normal [font-stretch:100%] font-normal text-[var(--ink)] shadow-[var(--shadow-input)] hover:bg-white focus-visible:border-transparent data-[state=open]:border-transparent data-[state=open]:shadow-[var(--focus-ring)] active:scale-100 disabled:cursor-not-allowed',
            className,
          )}
        >
          {selected?.prefix ? (
            <span
              className="w-4 shrink-0 text-center text-[var(--ink-3)]"
              aria-hidden="true"
            >
              {selected.prefix}
            </span>
          ) : Icon ? (
            <Icon
              className="size-4 shrink-0 text-[var(--ink-3)]"
              aria-hidden="true"
            />
          ) : null}
          <span
            className={cn(
              'min-w-0 truncate text-left',
              // A zero basis keeps a long label from widening the field.
              variant === 'default' && 'w-0 flex-1',
              !selectedLabel && !selected && 'text-[var(--ink-3)]',
            )}
          >
            {selectedLabel ?? selected?.label ?? placeholder}
          </span>
          {variant === 'discrete' ? (
            <ChevronDown
              className="size-3.5 shrink-0 text-[var(--ink-3)]"
              aria-hidden="true"
            />
          ) : (
            <ChevronsUpDown className="size-3.5 shrink-0 text-[var(--ink-3)]" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className={cn(
          'p-0',
          variant === 'discrete'
            ? 'w-[min(320px,calc(100vw-32px))]'
            : 'w-[var(--radix-popover-trigger-width)]',
        )}
      >
        <Command shouldFilter={!onSearchValueChange}>
          <CommandInput
            placeholder={searchPlaceholder}
            value={searchValue}
            onValueChange={onSearchValueChange}
          />
          <CommandList
            onScroll={(event) => {
              const list = event.currentTarget;
              if (
                hasMore &&
                !loading &&
                list.scrollTop + list.clientHeight >= list.scrollHeight - 48
              )
                onReachEnd?.();
            }}
          >
            {!loading && <CommandEmpty>{emptyMessage}</CommandEmpty>}
            {clearLabel && (
              <CommandGroup>
                <CommandItem
                  value="clear-selection"
                  onSelect={() => {
                    onValueChange('');
                    setOpen(false);
                  }}
                >
                  {clearLabel}
                </CommandItem>
              </CommandGroup>
            )}
            {groupOptions(options).map((group) => (
              <CommandGroup
                key={group.options[0]?.value ?? group.heading}
                heading={group.heading}
              >
                {group.options.map((option) => (
                  <CommandItem
                    key={option.value}
                    className="cursor-pointer"
                    value={`${option.label} ${option.value}`}
                    disabled={option.disabled}
                    onSelect={() => {
                      onValueChange(option.value);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        'size-3.5 stroke-[2.5] text-[var(--accent)]',
                        option.value === value ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                    {option.prefix ? (
                      <span
                        className="w-4 shrink-0 text-center text-[var(--ink-3)]"
                        aria-hidden="true"
                      >
                        {option.prefix}
                      </span>
                    ) : Icon ? (
                      <Icon
                        className="size-4 shrink-0 text-[var(--ink-3)]"
                        aria-hidden="true"
                      />
                    ) : null}
                    <span className="truncate">{option.label}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
            {loading && (
              <p className="px-2.5 py-2 text-[12px] text-[var(--ink-3)]">
                Chargement…
              </p>
            )}
            {errorMessage && (
              <div className="flex items-center justify-between gap-2 px-2.5 py-2 text-[12px] text-[var(--ink-2)]">
                <span>{errorMessage}</span>
                {onRetry && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={onRetry}
                  >
                    Réessayer
                  </Button>
                )}
              </div>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export type { ComboboxOption };
export { Combobox };
