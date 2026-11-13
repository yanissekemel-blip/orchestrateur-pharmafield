import type * as React from 'react';
import { Badge } from './badge';

export type StatusTone =
  | 'active'
  | 'pending'
  | 'danger'
  | 'warning'
  | 'info'
  | 'neutral';
export type RoleTone =
  | 'admin'
  | 'info'
  | 'warm'
  | 'success'
  | 'sage'
  | 'outline';

type BadgeVariant = NonNullable<React.ComponentProps<typeof Badge>['variant']>;

const statusVariants: Record<StatusTone, BadgeVariant> = {
  active: 'success',
  pending: 'secondary',
  danger: 'destructive',
  warning: 'warning',
  info: 'info',
  neutral: 'outline',
};

const roleVariants: Record<RoleTone, BadgeVariant> = {
  admin: 'signal',
  info: 'info',
  warm: 'warning',
  success: 'success',
  sage: 'secondary',
  outline: 'outline',
};

export function StatusPill({
  tone = 'neutral',
  ...props
}: React.ComponentProps<typeof Badge> & { tone?: StatusTone }) {
  return <Badge variant={statusVariants[tone]} {...props} />;
}

export function RolePill({
  tone = 'outline',
  ...props
}: React.ComponentProps<typeof Badge> & { tone?: RoleTone }) {
  return <Badge variant={roleVariants[tone]} {...props} />;
}
