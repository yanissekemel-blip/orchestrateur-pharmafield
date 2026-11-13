'use client';

import { X } from 'lucide-react';
import type { FormEvent, ReactNode } from 'react';
import { Button } from '../button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '../dialog';
import { cn } from '../utils';

type FormModalProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: ReactNode;
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  footerHint?: ReactNode;
  /** A failed submission, shown in the footer in place of the hint. */
  error?: ReactNode;
  submitLabel?: string;
  cancelLabel?: string;
  loadingLabel?: string;
  loading?: boolean;
  disabled?: boolean;
  hideFooter?: boolean;
  formId?: string;
  submitTone?: 'primary' | 'ink' | 'danger';
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void | Promise<void>;
  className?: string;
  bodyClassName?: string;
};

export function FormModal({
  open,
  onOpenChange,
  trigger,
  eyebrow,
  title,
  description,
  children,
  footerHint,
  error,
  submitLabel,
  cancelLabel = 'Annuler',
  loadingLabel = 'En cours…',
  loading = false,
  disabled = false,
  hideFooter = false,
  formId,
  submitTone = 'primary',
  onSubmit,
  className,
  bodyClassName,
}: FormModalProps) {
  const submitVariant = (
    {
      primary: 'default',
      ink: 'secondary',
      danger: 'destructive',
    } as const
  )[submitTone];

  const content = (
    <>
      <div className="flex items-start gap-4 px-[22px] pt-[22px] pb-1.5">
        <div className="min-w-0 flex-1">
          {eyebrow ? (
            <div className="text-[12px] font-semibold text-[var(--ink-3)]">
              {eyebrow}
            </div>
          ) : null}
          <DialogTitle className={eyebrow ? 'mt-1' : undefined}>
            {title}
          </DialogTitle>
          {description ? (
            <DialogDescription className="mt-1">
              {description}
            </DialogDescription>
          ) : null}
        </div>
        <DialogClose
          className={cn(
            'grid size-[30px] shrink-0 place-items-center rounded-[var(--radius-control)] text-[var(--ink-2)] outline-none transition-colors hover:bg-[var(--charcoal-a06)] hover:text-[var(--ink)] focus-visible:shadow-[var(--focus-ring)]',
            eyebrow ? 'mt-3.5' : '-mt-1',
          )}
        >
          <X className="size-4" />
          <span className="sr-only">Fermer</span>
        </DialogClose>
      </div>

      <div
        data-slot="modal-form-body"
        className={cn('flex flex-col gap-4 px-[22px] pt-4 pb-2', bodyClassName)}
      >
        {children}
      </div>

      {hideFooter ? null : (
        <DialogFooter className="flex flex-col gap-3 sm:justify-between">
          {error ? (
            <p
              role="alert"
              className="min-h-5 text-[12px] leading-5 font-semibold text-[var(--bad)]"
            >
              {error}
            </p>
          ) : (
            <div className="min-h-5 text-[12px] leading-5 font-medium text-[var(--ink-3)]">
              {footerHint}
            </div>
          )}
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <DialogClose asChild>
              <Button type="button" variant="discrete">
                {cancelLabel}
              </Button>
            </DialogClose>
            {submitLabel ? (
              <Button
                type="submit"
                form={formId}
                variant={submitVariant}
                disabled={loading || disabled}
              >
                {loading ? loadingLabel : submitLabel}
              </Button>
            ) : null}
          </div>
        </DialogFooter>
      )}
    </>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      <DialogContent
        showCloseButton={false}
        onOpenAutoFocus={(event) => {
          // Start in the first field rather than on the close button, except
          // on touch screens, where focus would raise the keyboard at once.
          if (window.matchMedia?.('(pointer: coarse)').matches) return;
          const content = event.currentTarget;
          if (!(content instanceof HTMLElement)) return;
          const field = content.querySelector<HTMLElement>(
            '[data-slot="modal-form-body"] :is(input, textarea, [role="combobox"]):not([type="hidden"], [type="color"], :disabled)',
          );
          if (!field) return;
          event.preventDefault();
          field.focus();
        }}
        className={cn(
          'gap-0 p-0 sm:max-w-[min(728px,calc(100vw-2rem))]',
          className,
        )}
      >
        {onSubmit ? <form onSubmit={onSubmit}>{content}</form> : content}
      </DialogContent>
    </Dialog>
  );
}
