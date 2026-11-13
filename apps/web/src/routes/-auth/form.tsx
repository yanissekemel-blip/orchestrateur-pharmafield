import { Button } from '@orchestrateur-pharmafield/ui/button';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@orchestrateur-pharmafield/ui/input-group';
import { Label } from '@orchestrateur-pharmafield/ui/label';
import { Spinner } from '@orchestrateur-pharmafield/ui/spinner';
import { Eye, EyeOff, KeyRound, type LucideIcon } from 'lucide-react';
import { type ComponentProps, type ReactNode, useState } from 'react';

type FieldChrome = { id: string; label: string; error?: string };

export function AuthField({
  label,
  error,
  id,
  icon: Icon,
  trailing,
  ...props
}: ComponentProps<typeof InputGroupInput> &
  FieldChrome & { icon: LucideIcon; trailing?: ReactNode }) {
  return (
    <div className="auth-field">
      <Label htmlFor={id} className="auth-field-label">
        {label}
      </Label>
      <InputGroup className="auth-input">
        <InputGroupAddon>
          <Icon aria-hidden="true" />
        </InputGroupAddon>
        <InputGroupInput
          id={id}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        />
        {trailing ? (
          <InputGroupAddon align="inline-end">{trailing}</InputGroupAddon>
        ) : null}
      </InputGroup>
      {error ? (
        <p id={`${id}-error`} role="alert" className="auth-field-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function PasswordField(
  props: Omit<ComponentProps<typeof AuthField>, 'icon' | 'type' | 'trailing'>,
) {
  const [visible, setVisible] = useState(false);
  return (
    <AuthField
      {...props}
      icon={KeyRound}
      type={visible ? 'text' : 'password'}
      trailing={
        <InputGroupButton
          size="icon-xs"
          aria-label={
            visible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'
          }
          aria-pressed={visible}
          aria-controls={props.id}
          onClick={() => setVisible((value) => !value)}
        >
          {visible ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
        </InputGroupButton>
      }
    />
  );
}

export function Submit({
  children,
  busy,
  busyLabel,
}: {
  children: ReactNode;
  busy: boolean;
  busyLabel: string;
}) {
  return (
    <Button type="submit" size="lg" className="w-full" disabled={busy}>
      {busy ? (
        <>
          <Spinner aria-hidden="true" className="text-[var(--ink)]" />
          {busyLabel}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
