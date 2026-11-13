'use client';

import {
  CircleAlert,
  CircleCheck,
  Info,
  LoaderCircle,
  TriangleAlert,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { createPortal } from 'react-dom';
import { Toaster as Sonner, type ToasterProps } from 'sonner';

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  // Render at <body> level: #root is its own stacking context, so a toaster
  // inside it would always sit below portalled modals and their blur.
  return createPortal(
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      closeButton
      containerAriaLabel="Notifications"
      icons={{
        success: <CircleCheck aria-hidden="true" />,
        info: <Info aria-hidden="true" />,
        warning: (
          <TriangleAlert aria-hidden="true" className="text-[var(--warn)]" />
        ),
        error: <CircleAlert aria-hidden="true" className="text-[var(--bad)]" />,
        loading: (
          <LoaderCircle
            aria-hidden="true"
            className="motion-safe:animate-spin"
          />
        ),
      }}
      toastOptions={{
        closeButtonAriaLabel: 'Fermer la notification',
        classNames: {
          // Dark charcoal by default; error and warning switch to a light surface.
          toast:
            'group/toast !pointer-events-auto !w-[400px] !max-w-[calc(100vw-2rem)] !items-center !gap-3.5 !rounded-[var(--radius-panel)] !border-0 !bg-[var(--normal-bg)] !py-3.5 !pr-6 !pl-4 !text-[var(--normal-text)] !shadow-[var(--shadow-float)]',
          title: '!text-[14px] !font-bold !leading-snug !text-inherit',
          description:
            '!mt-0.5 !text-[12.5px] !font-medium !leading-snug !text-[color-mix(in_srgb,var(--normal-text)_68%,transparent)]',
          // The type icon leads the toast, without any background fill.
          icon: '!m-0 !flex !size-5 !shrink-0 !items-center !justify-center [&_svg]:!size-5',
          // Sonner centres its loader absolutely; keep it in the icon slot.
          loader: '!static !size-full !transform-none',
          warning: '[--normal-bg:#fff] [--normal-text:var(--ink)]',
          error: '[--normal-bg:#fff] [--normal-text:var(--ink)]',
          closeButton:
            '!size-6 !rounded-[var(--radius-sm)] !border-0 !bg-[var(--normal-bg)] !text-[color-mix(in_srgb,var(--normal-text)_70%,transparent)] !shadow-[0_2px_8px_rgba(36, 36, 36,0.18)] hover:!bg-[var(--normal-bg)] hover:!text-[var(--normal-text)] [&_svg]:!size-3',
        },
      }}
      style={
        {
          '--normal-bg': 'var(--charcoal-900)',
          '--normal-text': '#fff',
          '--normal-border': 'transparent',
          '--border-radius': 'var(--radius-card)',
          // Place the close control on the top-right corner.
          '--toast-close-button-start': 'unset',
          '--toast-close-button-end': '0',
          '--toast-close-button-transform': 'translate(35%, -35%)',
        } as React.CSSProperties
      }
      {...props}
    />,
    document.body,
  );
};

export { Toaster };
