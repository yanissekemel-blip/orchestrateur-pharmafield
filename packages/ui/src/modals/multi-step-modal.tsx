'use client';

import { Check, type LucideIcon, X } from 'lucide-react';
import { useAnimate } from 'motion/react-mini';
import { type FormEvent, type ReactNode, useEffect, useRef } from 'react';
import { Button } from '../button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '../dialog';
import { cn } from '../utils';

export type MultiStepModalStep = {
  id: string;
  label: string;
  description?: string;
  /** Shown in the step pill instead of its number until the step is done. */
  icon?: LucideIcon;
};

type MultiStepModalProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: ReactNode;
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  steps: MultiStepModalStep[];
  currentStep: number;
  children: ReactNode;
  footerHint?: ReactNode;
  cancelLabel?: string;
  previousLabel?: string;
  nextLabel?: string;
  submitLabel?: string;
  loading?: boolean;
  nextDisabled?: boolean;
  onPrevious?: () => void;
  onNext?: () => void;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void | Promise<void>;
  className?: string;
  sidecar?: ReactNode;
};

export function MultiStepModal({
  open,
  onOpenChange,
  trigger,
  eyebrow,
  title,
  description,
  steps,
  currentStep,
  children,
  footerHint,
  cancelLabel = 'Annuler',
  previousLabel = 'Précédent',
  nextLabel = 'Suivant',
  submitLabel,
  loading = false,
  nextDisabled = false,
  onPrevious,
  onNext,
  onSubmit,
  className,
  sidecar,
}: MultiStepModalProps) {
  const isLastStep = currentStep >= steps.length - 1;
  const [stepScope, animateStep] = useAnimate<HTMLDivElement>();
  const previousStep = useRef(currentStep);

  // Each new step slides in from the side it comes from.
  useEffect(() => {
    const from = previousStep.current;
    previousStep.current = currentStep;
    const element = stepScope.current;
    if (from === currentStep || typeof element?.animate !== 'function') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const offset = currentStep > from ? 24 : -24;
    animateStep(
      element,
      {
        opacity: [0, 1],
        transform: [`translateX(${offset}px)`, 'translateX(0px)'],
      },
      { duration: 0.34, ease: [0.2, 0.8, 0.2, 1] },
    );
  }, [currentStep, animateStep, stepScope]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      <DialogContent
        showCloseButton={false}
        className={cn(
          'max-h-[calc(100vh-80px)] gap-0 overflow-visible p-0 sm:max-w-[min(832px,calc(100vw-2rem))]',
          sidecar && 'xl:left-[calc(50%-186px)]',
          className,
        )}
      >
        <form
          className="flex max-h-[calc(100vh-80px)] flex-col"
          onSubmit={onSubmit}
        >
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

          <div className="shrink-0 px-[22px] pt-3">
            <ol
              className="flex gap-1.5 overflow-x-auto"
              style={{ '--step-count': steps.length } as React.CSSProperties}
            >
              {steps.map((step, index) => {
                const isDone = index < currentStep;
                const isCurrent = index === currentStep;
                const StepIcon = step.icon;

                return (
                  <li
                    key={step.id}
                    aria-current={isCurrent ? 'step' : undefined}
                    className={cn(
                      'flex h-[26px] max-w-[200px] shrink-0 items-center gap-1.5 rounded-[var(--radius-control)] px-2.5 text-[11.5px] font-bold transition-colors duration-300',
                      isDone && 'bg-[var(--charcoal-900)] text-white',
                      isCurrent && 'bg-[var(--accent)] text-white',
                      !isDone &&
                        !isCurrent &&
                        'bg-[var(--charcoal-a06)] text-[var(--ink-2)]',
                    )}
                  >
                    <span className="shrink-0 font-mono text-[10.5px]">
                      {isDone ? (
                        <Check className="size-3" aria-hidden="true" />
                      ) : StepIcon ? (
                        <StepIcon className="size-3.5" aria-hidden="true" />
                      ) : (
                        index + 1
                      )}
                    </span>
                    <span className="min-w-0 truncate">{step.label}</span>
                  </li>
                );
              })}
            </ol>
          </div>

          <div
            data-slot="modal-form-body"
            className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-[22px] pt-4 pb-2"
          >
            <div ref={stepScope}>{children}</div>
          </div>

          <div className="modal-footer-surface flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="font-mono text-[10.5px] leading-5 text-[var(--ink-3)]">
              {footerHint ?? (
                <>
                  Étape {currentStep + 1} / {steps.length}
                  {steps[currentStep]?.label
                    ? ` · ${steps[currentStep].label}`
                    : ''}
                </>
              )}
            </div>
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              {currentStep === 0 || !onPrevious ? (
                <DialogClose asChild>
                  <Button type="button" variant="discrete" disabled={loading}>
                    {cancelLabel}
                  </Button>
                </DialogClose>
              ) : (
                <Button
                  type="button"
                  variant="discrete"
                  onClick={onPrevious}
                  disabled={loading}
                >
                  {previousLabel}
                </Button>
              )}
              {isLastStep ? (
                // Distinct keys stop React reusing the Next button as the submit
                // button mid-click, which would submit the form early.
                <Button
                  key="submit"
                  type="submit"
                  disabled={loading || nextDisabled}
                >
                  {loading ? 'En cours…' : (submitLabel ?? 'Terminer')}
                </Button>
              ) : (
                <Button
                  key="next"
                  type="button"
                  onClick={onNext}
                  disabled={loading || nextDisabled}
                >
                  {nextLabel}
                </Button>
              )}
            </div>
          </div>
        </form>
        {sidecar ? (
          <div className="absolute left-[calc(100%+12px)] top-0 hidden h-full w-[360px] xl:block">
            {sidecar}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
