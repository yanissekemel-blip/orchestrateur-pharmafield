'use client';

import type { ReactNode } from 'react';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../alert-dialog';
import { Button } from '../button';
import { cn } from '../utils';

type ConfirmModalTone = 'neutral' | 'destructive';

/** A second, lower-emphasis way to resolve the question. */
type ConfirmModalSecondaryAction = {
  label: string;
  onAction: () => void | Promise<void>;
  /** `outline` by default; `destructive` when it is the risky choice. */
  variant?: 'outline' | 'destructive';
};

type ConfirmModalProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: ReactNode;
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  tone?: ConfirmModalTone;
  loading?: boolean;
  disabled?: boolean;
  onConfirm: () => void | Promise<void>;
  /** Shown before the primary action, for example "Retry anyway". */
  secondaryAction?: ConfirmModalSecondaryAction;
};

export function ConfirmModal({
  open,
  onOpenChange,
  trigger,
  eyebrow,
  title,
  description,
  children,
  confirmLabel,
  cancelLabel = 'Annuler',
  tone = 'neutral',
  loading = false,
  disabled = false,
  onConfirm,
  secondaryAction,
}: ConfirmModalProps) {
  const isDestructive = tone === 'destructive';

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {trigger ? (
        <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      ) : null}
      <AlertDialogContent className="max-w-[480px] gap-0 p-0">
        <div className="px-[22px] pt-[22px] pb-1.5">
          <div className="flex items-start gap-3.5">
            <div className="min-w-0 flex-1">
              {eyebrow ? (
                <div
                  className={cn(
                    'text-[12px] font-semibold',
                    isDestructive ? 'text-[var(--bad)]' : 'text-[var(--ink-3)]',
                  )}
                >
                  {eyebrow}
                </div>
              ) : null}
              <AlertDialogTitle className={eyebrow ? 'mt-1' : undefined}>
                {title}
              </AlertDialogTitle>
              {description ? (
                <AlertDialogDescription className="mt-1">
                  {description}
                </AlertDialogDescription>
              ) : null}
              {children ? <div className="mt-3">{children}</div> : null}
            </div>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
          {secondaryAction ? (
            <Button
              type="button"
              variant={secondaryAction.variant ?? 'outline'}
              disabled={loading || disabled}
              onClick={() => void secondaryAction.onAction()}
            >
              {secondaryAction.label}
            </Button>
          ) : null}
          <Button
            type="button"
            variant={isDestructive ? 'destructive' : 'default'}
            disabled={loading || disabled}
            onClick={() => void onConfirm()}
          >
            {loading ? 'En cours…' : confirmLabel}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
