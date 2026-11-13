'use client';

import { ListFilter, type LucideIcon, Plus, Trash2, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { Button } from './button';
import { DatePicker } from './date-picker';
import { DateTimePicker } from './date-time-picker';
import { Input } from './input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './sheet';

export type TableFilterOperator =
  | 'eq'
  | 'neq'
  | 'contains'
  | 'not_contains'
  | 'starts_with'
  | 'ends_with'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'is_empty'
  | 'is_not_empty';
export type TableFilterRule = {
  field: string;
  operator: TableFilterOperator;
  value?: string;
};
export type TableFilterGroups = { groups: { rules: TableFilterRule[] }[] };
export type TableFilterField = {
  id: string;
  label: string;
  kind: 'text' | 'choice' | 'number' | 'date' | 'instant' | 'entity';
  options?: readonly { value: string; label: string }[];
  nullable?: boolean;
  icon?: LucideIcon;
};
const labels: Record<TableFilterOperator, string> = {
  eq: 'est',
  neq: 'n’est pas',
  contains: 'contient',
  not_contains: 'ne contient pas',
  starts_with: 'commence par',
  ends_with: 'se termine par',
  gt: 'est après / supérieur à',
  gte: 'est le ou après / au moins',
  lt: 'est avant / inférieur à',
  lte: 'est le ou avant / au plus',
  is_empty: 'est vide',
  is_not_empty: 'n’est pas vide',
};
const noValue = (operator: TableFilterOperator) =>
  operator === 'is_empty' || operator === 'is_not_empty';
function operators(field: TableFilterField): TableFilterOperator[] {
  const base: TableFilterOperator[] =
    field.kind === 'text'
      ? ['contains', 'not_contains', 'starts_with', 'ends_with', 'eq', 'neq']
      : field.kind === 'choice' || field.kind === 'entity'
        ? ['eq', 'neq']
        : field.kind === 'instant'
          ? ['gt', 'gte', 'lt', 'lte']
          : ['eq', 'neq', 'gt', 'gte', 'lt', 'lte'];
  return field.nullable ? [...base, 'is_empty', 'is_not_empty'] : base;
}
const initialRule = (field: TableFilterField): TableFilterRule => ({
  field: field.id,
  operator: operators(field)[0] ?? 'eq',
});

export function TableFilterSheet({
  fields,
  value,
  onChange,
  renderEntityValue,
}: {
  fields: readonly TableFilterField[];
  value?: TableFilterGroups | null;
  onChange: (value: TableFilterGroups | null) => void;
  renderEntityValue?: (
    field: TableFilterField,
    value: string | undefined,
    onChange: (value: string | undefined) => void,
  ) => React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<TableFilterGroups>(
    value ?? { groups: [] },
  );
  const [limitReached, setLimitReached] = useState(false);
  const keys = useRef(
    (value?.groups ?? []).map((group) => ({
      group: crypto.randomUUID(),
      rules: group.rules.map(() => crypto.randomUUID()),
    })),
  );
  const resetDraft = () => {
    setDraft(value ?? { groups: [] });
    setLimitReached(false);
    keys.current = (value?.groups ?? []).map((group) => ({
      group: crypto.randomUUID(),
      rules: group.rules.map(() => crypto.randomUUID()),
    }));
  };
  const first = fields[0];
  if (!first) return null;
  const complete = (next: TableFilterGroups): TableFilterGroups | null => {
    const groups = next.groups
      .map((group) => ({
        rules: group.rules.filter(
          (rule) =>
            operators(
              fields.find((field) => field.id === rule.field) ?? first,
            ).includes(rule.operator) &&
            (noValue(rule.operator) || !!rule.value?.trim()),
        ),
      }))
      .filter((group) => group.rules.length);
    return groups.length ? { groups } : null;
  };
  const change = (next: TableFilterGroups) => {
    const result = complete(next);
    if (result && JSON.stringify(result).length > 4096) {
      setLimitReached(true);
      return;
    }
    setLimitReached(false);
    setDraft(next);
  };
  const updateRule = (
    groupIndex: number,
    ruleIndex: number,
    patch: Partial<TableFilterRule>,
  ) =>
    change({
      groups: draft.groups.map((group, gi) =>
        gi === groupIndex
          ? {
              rules: group.rules.map((rule, ri) =>
                ri === ruleIndex ? { ...rule, ...patch } : rule,
              ),
            }
          : group,
      ),
    });
  const count =
    value?.groups.reduce((n, group) => n + group.rules.length, 0) ?? 0;
  const draftCount = draft.groups.reduce(
    (n, group) => n + group.rules.length,
    0,
  );
  const applied = complete(draft);
  const completeCount =
    applied?.groups.reduce((n, group) => n + group.rules.length, 0) ?? 0;
  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        if (next) resetDraft();
        setOpen(next);
      }}
    >
      <SheetTrigger asChild>
        <Button
          variant={count ? 'secondary' : 'outline'}
          aria-label={`Filtres${count ? ` (actifs : ${count})` : ''}`}
          data-active={count > 0}
          className="px-4 has-[>svg]:px-4"
        >
          <ListFilter aria-hidden="true" />
          Filtres
          {count > 0 && (
            <span
              className="grid min-w-[18px] place-items-center rounded-[var(--radius-control)] bg-[var(--accent)] px-1 text-[10.5px] leading-[18px] font-extrabold text-white tabular-nums"
              aria-hidden="true"
            >
              {count}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent showCloseButton={false} className="sm:max-w-[500px]">
        <SheetClose
          className="absolute top-[18px] right-[18px] grid size-[30px] place-items-center rounded-[var(--radius-control)] text-[var(--ink-2)] outline-none transition-[background-color,color,box-shadow] duration-150 hover:bg-[var(--charcoal-a06)] hover:text-[var(--ink)] focus-visible:shadow-[var(--focus-ring)] motion-reduce:transition-none"
          aria-label="Fermer les filtres"
        >
          <X className="size-4" aria-hidden="true" />
        </SheetClose>
        <SheetHeader className="gap-0.5 px-[22px] pt-[22px] pb-1.5 pr-16">
          <div className="flex items-center gap-2">
            <ListFilter
              className="size-4 text-[var(--ink-2)]"
              aria-hidden="true"
            />
            <SheetTitle>Filtres</SheetTitle>
          </div>
          <SheetDescription className="text-[12.5px] leading-5 text-[var(--ink-2)]">
            Remplissez toutes les conditions d’un groupe, ou celles d’un autre
            groupe.
          </SheetDescription>
        </SheetHeader>
        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-[22px] py-4">
          {draft.groups.length === 0 && (
            <p className="rounded-[var(--radius-card)] border border-dashed border-[var(--charcoal-a15)] p-6 text-center text-[12.5px] text-[var(--ink-2)]">
              Aucun filtre pour l’instant. Ajoutez une condition pour affiner ce
              tableau.
            </p>
          )}
          {draft.groups.map((group, gi) => (
            <div key={keys.current[gi]?.group}>
              {gi > 0 && (
                <div className="mb-3 flex items-center gap-3 text-[12px] font-semibold text-[var(--ink-3)]">
                  <span className="h-px flex-1 bg-[var(--charcoal-a07)]" />
                  OU
                  <span className="h-px flex-1 bg-[var(--charcoal-a07)]" />
                </div>
              )}
              <section className="rounded-[var(--radius-card)] border border-white/95 bg-[var(--surface-card)] p-3 shadow-card">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[11.5px] font-bold text-[var(--ink-2)]">
                    Toutes les conditions · Groupe {gi + 1}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    aria-label={`Supprimer le groupe ${gi + 1}`}
                    onClick={() => {
                      keys.current.splice(gi, 1);
                      change({
                        groups: draft.groups.filter((_, i) => i !== gi),
                      });
                    }}
                  >
                    <Trash2 aria-hidden="true" />
                  </Button>
                </div>
                <div className="space-y-3">
                  {group.rules.map((rule, ri) => {
                    const field =
                      fields.find((item) => item.id === rule.field) ?? first;
                    return (
                      <div key={keys.current[gi]?.rules[ri]}>
                        {ri > 0 && (
                          <div className="flex items-center gap-2 py-1.5 text-[12px] font-semibold text-[var(--ink-3)]">
                            <span className="h-px w-3 bg-[var(--charcoal-a07)]" />{' '}
                            AND
                          </div>
                        )}
                        <div className="flex min-h-10 items-center gap-1 rounded-[var(--radius-card)] border border-[var(--charcoal-a10)] bg-white px-1.5 shadow-[var(--shadow-input)]">
                          <Select
                            value={rule.field}
                            onValueChange={(id) => {
                              const next = fields.find(
                                (item) => item.id === id,
                              );
                              if (next) updateRule(gi, ri, initialRule(next));
                            }}
                          >
                            <SelectTrigger
                              variant="quiet"
                              aria-label={`Champ du filtre ${gi + 1}.${ri + 1}`}
                              className="min-w-0 basis-[34%] gap-1 px-1.5"
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {fields.map((item) => (
                                <SelectItem key={item.id} value={item.id}>
                                  {item.icon && (
                                    <item.icon
                                      className="size-3.5 text-[var(--ink-3)]"
                                      aria-hidden="true"
                                    />
                                  )}
                                  {item.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <span
                            className="h-5 w-px shrink-0 bg-[var(--charcoal-a07)]"
                            aria-hidden="true"
                          />
                          <Select
                            value={rule.operator}
                            onValueChange={(operator) =>
                              updateRule(gi, ri, {
                                operator: operator as TableFilterOperator,
                                value: undefined,
                              })
                            }
                          >
                            <SelectTrigger
                              variant="quiet"
                              aria-label={`Opérateur du filtre ${gi + 1}.${ri + 1}`}
                              className="min-w-0 basis-[21%] px-1.5"
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {operators(field).map((operator) => (
                                <SelectItem key={operator} value={operator}>
                                  {labels[operator]}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <span
                            className="h-5 w-px shrink-0 bg-[var(--charcoal-a07)]"
                            aria-hidden="true"
                          />
                          <div className="min-w-0 flex-1">
                            {noValue(rule.operator) ? (
                              <span className="px-2 text-[11.5px] text-[var(--ink-3)]">
                                Aucune valeur
                              </span>
                            ) : field.kind === 'choice' ? (
                              <Select
                                value={rule.value ?? ''}
                                onValueChange={(v) =>
                                  updateRule(gi, ri, { value: v })
                                }
                              >
                                <SelectTrigger
                                  variant="quiet"
                                  aria-label={`Valeur ${field.label}`}
                                  className="w-full min-w-0 px-1.5"
                                >
                                  <SelectValue placeholder="Sélectionner" />
                                </SelectTrigger>
                                <SelectContent>
                                  {field.options?.map((option) => (
                                    <SelectItem
                                      key={option.value}
                                      value={option.value}
                                    >
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            ) : field.kind === 'entity' ? (
                              renderEntityValue?.(field, rule.value, (v) =>
                                updateRule(gi, ri, { value: v }),
                              )
                            ) : field.kind === 'date' ? (
                              <DatePicker
                                aria-label={`Valeur ${field.label}`}
                                className="min-w-0 border-transparent bg-transparent px-1.5 shadow-none"
                                value={rule.value}
                                onValueChange={(v) =>
                                  updateRule(gi, ri, { value: v ?? undefined })
                                }
                              />
                            ) : field.kind === 'instant' ? (
                              <DateTimePicker
                                aria-label={`Valeur ${field.label}`}
                                className="min-w-0 border-transparent bg-transparent px-1.5 shadow-none"
                                value={rule.value}
                                onValueChange={(v) =>
                                  updateRule(gi, ri, { value: v ?? undefined })
                                }
                              />
                            ) : (
                              <Input
                                aria-label={`Valeur ${field.label}`}
                                type={
                                  field.kind === 'number' ? 'number' : 'text'
                                }
                                maxLength={500}
                                className="border-transparent bg-transparent px-1.5 shadow-none"
                                value={rule.value ?? ''}
                                onChange={(event) =>
                                  updateRule(gi, ri, {
                                    value: event.target.value,
                                  })
                                }
                                placeholder="Valeur"
                              />
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            className="text-[var(--ink-3)] hover:text-[var(--bad)]"
                            aria-label={`Supprimer la condition ${gi + 1}.${ri + 1}`}
                            onClick={() => {
                              keys.current[gi]?.rules.splice(ri, 1);
                              if (!keys.current[gi]?.rules.length)
                                keys.current.splice(gi, 1);
                              change({
                                groups: draft.groups
                                  .map((item, i) =>
                                    i === gi
                                      ? {
                                          rules: item.rules.filter(
                                            (_, j) => j !== ri,
                                          ),
                                        }
                                      : item,
                                  )
                                  .filter((item) => item.rules.length),
                              });
                            }}
                          >
                            <Trash2 aria-hidden="true" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-1"
                  disabled={
                    draft.groups.reduce(
                      (n, item) => n + item.rules.length,
                      0,
                    ) >= 20
                  }
                  onClick={() => {
                    keys.current[gi]?.rules.push(crypto.randomUUID());
                    change({
                      groups: draft.groups.map((item, i) =>
                        i === gi
                          ? { rules: [...item.rules, initialRule(first)] }
                          : item,
                      ),
                    });
                  }}
                >
                  <Plus aria-hidden="true" /> Ajouter une condition ET
                </Button>
              </section>
            </div>
          ))}
          <Button
            variant="outline"
            className="w-full"
            disabled={
              draft.groups.length >= 5 ||
              draft.groups.reduce((n, group) => n + group.rules.length, 0) >= 20
            }
            onClick={() => {
              keys.current.push({
                group: crypto.randomUUID(),
                rules: [crypto.randomUUID()],
              });
              change({
                groups: [...draft.groups, { rules: [initialRule(first)] }],
              });
            }}
          >
            <Plus aria-hidden="true" /> Ajouter{' '}
            {draft.groups.length ? 'un groupe OU' : 'une condition'}
          </Button>
        </div>
        {(limitReached || draftCount !== completeCount) && (
          <p
            role="status"
            className="px-[22px] pb-2 text-[11.5px] text-[var(--ink-2)]"
          >
            {limitReached
              ? 'Limite de filtres atteinte. Raccourcissez une valeur ou supprimez une condition.'
              : 'Complétez chaque condition pour appliquer les filtres.'}
          </p>
        )}
        <SheetFooter className="flex-row items-center justify-between">
          <Button
            variant="discrete"
            size="sm"
            disabled={!draft.groups.length}
            onClick={() => {
              keys.current = [];
              change({ groups: [] });
            }}
          >
            Tout effacer
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="discrete" size="sm" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button
              size="sm"
              disabled={limitReached || draftCount !== completeCount}
              onClick={() => {
                onChange(applied);
                setOpen(false);
              }}
            >
              Appliquer les filtres
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
