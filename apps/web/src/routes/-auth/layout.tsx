import { Panel } from '@orchestrateur-pharmafield/ui/panel';
import { PharmafieldLogo } from '@orchestrateur-pharmafield/ui/pharmafield-logo';
import type { ReactNode } from 'react';

export function AuthLayout({
  title,
  description,
  children,
}: {
  title: string;
  description?: ReactNode;
  children: ReactNode;
}) {
  return (
    <main className="auth-layout">
      <Panel asChild padding="none">
        <div className="auth-surface">
          <section className="auth-story" aria-label="Pharmafield">
            <div className="auth-emblem">
              <div className="auth-emblem-backdrop" aria-hidden="true" />
              <PharmafieldLogo
                title="Pharmafield Groupe"
                className="auth-emblem-wordmark"
              />
            </div>
          </section>
          <Panel variant="raised" padding="none" asChild>
            <section className="auth-form-side">
              <div className="auth-form">
                <header className="auth-form-header">
                  <h1>{title}</h1>
                  {description ? <p>{description}</p> : null}
                </header>
                <div className="auth-form-body">{children}</div>
              </div>
            </section>
          </Panel>
        </div>
      </Panel>
    </main>
  );
}
