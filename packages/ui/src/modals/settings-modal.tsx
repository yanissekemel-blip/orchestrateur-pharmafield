'use client';

import type { LucideIcon } from 'lucide-react';
import { X } from 'lucide-react';
import { Tabs as TabsPrimitive } from 'radix-ui';
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { Button } from '../button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from '../dialog';
import { Panel } from '../panel';
import { useActiveIndicator } from '../use-active-indicator';
import { cn } from '../utils';

const SettingsActionsTarget = createContext<HTMLElement | null>(null);

/**
 * Footer actions for the active settings section, such as a form's submit
 * button (`form="<id>"`). Inside `SettingsModal` they render in the shared
 * footer beside Close; elsewhere they render inline, right-aligned.
 */
export function SettingsActions({ children }: { children: ReactNode }) {
  const target = useContext(SettingsActionsTarget);
  if (target) return createPortal(children, target);
  return (
    <div className="flex flex-wrap justify-end gap-2 px-5 py-3">{children}</div>
  );
}

export type SettingsModalTab = {
  id: string;
  label: string;
  /** Shown under the section title in the content pane. */
  description?: ReactNode;
  icon?: LucideIcon;
  group?: string;
  badge?: string | number;
  variant?: 'danger';
};

type SettingsModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  tabs: SettingsModalTab[];
  /** Tab selected whenever the modal opens (uncontrolled mode). */
  defaultTab?: string;
  /** Controlled active tab. Pair with `onTabChange`. */
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  children: (activeTab: string) => ReactNode;
};

export function SettingsModal({
  open,
  onOpenChange,
  title,
  description,
  tabs,
  defaultTab,
  activeTab: controlledTab,
  onTabChange,
  children,
}: SettingsModalProps) {
  const settingsNavRef = useActiveIndicator<HTMLDivElement>(
    '[role="tab"][data-state="active"]',
  );
  const [actionsTarget, setActionsTarget] = useState<HTMLDivElement | null>(
    null,
  );
  const initialTab = defaultTab ?? tabs[0]?.id ?? '';
  const [localTab, setLocalTab] = useState(initialTab);

  // Reset to the requested tab each time the modal opens.
  useEffect(() => {
    if (open) setLocalTab(initialTab);
  }, [open, initialTab]);

  const requestedTab = controlledTab ?? localTab;
  const activeTab = tabs.some((tab) => tab.id === requestedTab)
    ? requestedTab
    : (tabs[0]?.id ?? '');
  const active = tabs.find((tab) => tab.id === activeTab);
  const selectTab = (tab: string) => {
    setLocalTab(tab);
    onTabChange?.(tab);
  };

  const groups = useMemo(() => {
    const result: Array<{ label?: string; tabs: SettingsModalTab[] }> = [];
    for (const tab of tabs) {
      const last = result.at(-1);
      if (last && last.label === tab.group) last.tabs.push(tab);
      else result.push({ label: tab.group, tabs: [tab] });
    }
    return result;
  }, [tabs]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="flex h-[min(720px,calc(100dvh-2rem))] flex-col sm:max-w-[min(980px,calc(100vw-2rem))]"
      >
        <TabsPrimitive.Root
          orientation="vertical"
          value={activeTab}
          onValueChange={selectTab}
          className="flex min-h-0 flex-1 flex-col md:flex-row"
        >
          <aside className="flex shrink-0 flex-col border-b border-[var(--line)] bg-[var(--charcoal-a03)] md:w-[232px] md:border-r md:border-b-0">
            <div className="flex items-start gap-3 px-5 pt-5 pb-3 md:pb-4">
              <div className="min-w-0 flex-1">
                <DialogTitle className="text-[15px] font-heading">
                  {title}
                </DialogTitle>
                {description ? (
                  <DialogDescription className="mt-0.5 text-[11.5px]">
                    {description}
                  </DialogDescription>
                ) : null}
              </div>
              <CloseButton className="-mt-1 -mr-1 md:hidden" />
            </div>
            <TabsPrimitive.List
              ref={settingsNavRef}
              aria-label="Sections des paramètres"
              className="flex gap-1 [--indicator-radius:var(--radius-control)] overflow-x-auto px-3 pb-3 [scrollbar-width:none] md:flex-1 md:flex-col md:gap-0 md:overflow-x-visible md:overflow-y-auto md:pb-4"
            >
              {groups.map((group, index) => (
                <div
                  key={`${group.label ?? 'group'}-${group.tabs[0]?.id}`}
                  role="presentation"
                  className="flex shrink-0 gap-1 md:flex-col md:gap-0.5"
                >
                  {group.label ? (
                    <div
                      aria-hidden="true"
                      className={cn(
                        'hidden px-3 pb-1.5 text-[11.5px] font-bold text-[var(--ink-3)] md:block',
                        index > 0 ? 'pt-5' : 'pt-1',
                      )}
                    >
                      {group.label}
                    </div>
                  ) : null}
                  {group.tabs.map((tab) => (
                    <SettingsTabTrigger key={tab.id} tab={tab} />
                  ))}
                </div>
              ))}
            </TabsPrimitive.List>
          </aside>

          <div className="flex min-h-0 min-w-0 flex-1 flex-col">
            <div className="flex shrink-0 items-start gap-3 px-6 pt-5 pb-4 md:px-8 md:pt-6">
              <div className="min-w-0 flex-1">
                <h2
                  className={cn(
                    'text-[18px] font-heading',
                    active?.variant === 'danger' && 'text-[var(--bad)]',
                  )}
                >
                  {active?.label}
                </h2>
                {active?.description ? (
                  <p className="mt-0.5 text-[12.5px] text-[var(--ink-2)]">
                    {active.description}
                  </p>
                ) : null}
              </div>
              <CloseButton className="-mt-1 -mr-2 hidden md:grid" />
            </div>
            <TabsPrimitive.Content
              key={activeTab}
              data-slot="settings-tab-content"
              value={activeTab}
              className="min-h-0 flex-1 overflow-y-auto px-6 pb-6 outline-none md:px-8 md:pb-8"
            >
              <SettingsActionsTarget.Provider value={actionsTarget}>
                <div className="grid max-w-[640px] grid-cols-1 gap-6">
                  {children(activeTab)}
                </div>
              </SettingsActionsTarget.Provider>
            </TabsPrimitive.Content>
            <DialogFooter className="shrink-0">
              <DialogClose asChild>
                <Button type="button" variant="discrete">
                  Fermer
                </Button>
              </DialogClose>
              <div
                ref={setActionsTarget}
                className="flex flex-col-reverse gap-2 empty:hidden sm:flex-row"
              />
            </DialogFooter>
          </div>
        </TabsPrimitive.Root>
      </DialogContent>
    </Dialog>
  );
}

function SettingsTabTrigger({ tab }: { tab: SettingsModalTab }) {
  const Icon = tab.icon;
  return (
    <TabsPrimitive.Trigger
      value={tab.id}
      className={cn(
        'group/settings-tab flex h-9 shrink-0 items-center gap-2.5 rounded-[var(--radius-card)] px-3 text-left text-[13px] font-semibold whitespace-nowrap text-[var(--ink-2)] outline-none transition-[background-color,color,box-shadow] duration-150 hover:bg-[var(--charcoal-a06)] hover:text-[var(--ink)] focus-visible:shadow-[var(--focus-ring)] motion-reduce:transition-none md:w-full',
        'data-[state=active]:bg-white data-[state=active]:font-bold data-[state=active]:text-[var(--ink)] data-[state=active]:shadow-[var(--shadow-raised)]',
        tab.variant === 'danger' &&
          'hover:text-[var(--bad)] data-[state=active]:text-[var(--bad)]',
      )}
    >
      {Icon ? (
        <Icon
          aria-hidden="true"
          className="size-4 shrink-0 text-[var(--ink-3)] group-data-[state=active]/settings-tab:text-current"
        />
      ) : null}
      <span className="min-w-0 flex-1 truncate">{tab.label}</span>
      {tab.badge !== undefined && tab.badge !== '' ? (
        <span className="font-mono text-[10.5px] font-bold text-[var(--ink-3)] tabular">
          {tab.badge}
        </span>
      ) : null}
    </TabsPrimitive.Trigger>
  );
}

function CloseButton({ className }: { className?: string }) {
  return (
    <DialogClose
      className={cn(
        'grid size-[30px] shrink-0 place-items-center rounded-[var(--radius-control)] text-[var(--ink-2)] outline-none transition-colors hover:bg-[var(--charcoal-a06)] hover:text-[var(--ink)] focus-visible:shadow-[var(--focus-ring)]',
        className,
      )}
    >
      <X className="size-4" />
      <span className="sr-only">Fermer</span>
    </DialogClose>
  );
}

/**
 * A titled group of settings. Rows render inside one card separated by
 * dividers; `tone="danger"` marks destructive groups.
 */
export function SettingsSection({
  title,
  description,
  actions,
  tone,
  children,
  className,
}: {
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  tone?: 'danger';
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      data-slot="settings-section"
      className={cn('grid grid-cols-1 gap-2.5', className)}
    >
      {title || actions ? (
        <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-1">
          <div className="min-w-0">
            {title ? (
              <h3
                className={cn(
                  'text-[13.5px] font-heading',
                  tone === 'danger' && 'text-[var(--bad)]',
                )}
              >
                {title}
              </h3>
            ) : null}
            {description ? (
              <p className="mt-0.5 text-[11.5px] text-[var(--ink-2)]">
                {description}
              </p>
            ) : null}
          </div>
          {actions ? <div className="flex gap-2">{actions}</div> : null}
        </div>
      ) : null}
      <Panel
        padding="none"
        elevation={tone === 'danger' ? 'none' : 'default'}
        className={cn(
          'divide-y divide-[var(--line-2)]',
          tone === 'danger' && 'border-[var(--bad-soft)]',
        )}
      >
        {children}
      </Panel>
    </section>
  );
}

/** One setting: label and help text on the left, its control on the right. */
export function SettingsRow({
  label,
  description,
  children,
  stacked = false,
  className,
}: {
  label?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  /** Put the control under the label instead of beside it. */
  stacked?: boolean;
  className?: string;
}) {
  return (
    <div
      data-slot="settings-row"
      className={cn(
        'flex gap-x-6 gap-y-3 px-5 py-4',
        stacked ? 'flex-col' : 'flex-wrap items-center justify-between',
        className,
      )}
    >
      {label || description ? (
        <div className={cn('min-w-0', !stacked && 'flex-1 basis-56')}>
          {label ? (
            <div className="text-[13px] font-bold text-[var(--ink)]">
              {label}
            </div>
          ) : null}
          {description ? (
            <div className="mt-0.5 text-[11.5px] text-[var(--ink-2)]">
              {description}
            </div>
          ) : null}
        </div>
      ) : null}
      {children}
    </div>
  );
}
