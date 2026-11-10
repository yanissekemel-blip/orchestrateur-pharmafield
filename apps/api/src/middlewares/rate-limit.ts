import type { Context, MiddlewareHandler } from 'hono';
import { routePath } from 'hono/route';
import { apiError } from '../lib/api-error';
import type { AppEnv } from './auth';

type Window = { count: number; resetAt: number };

// In-memory fixed windows: counters are per API process and reset on restart.
// Run a single API replica, or move this to shared storage, before scaling out.
const windows = new Map<string, Window>();

const sweep = setInterval(() => {
  const now = Date.now();
  for (const [key, window] of windows) {
    if (window.resetAt <= now) windows.delete(key);
  }
}, 60_000);
sweep.unref();

export function consumeRateLimit(
  c: Context<AppEnv>,
  maxRequests: number,
  windowSeconds: number,
  scope?: string,
): 'allowed' | 'limited' {
  const address = c.req.header('x-real-ip') ?? 'unknown';
  const key = `${scope ?? routePath(c, -1)}:${address}`;
  const now = Date.now();
  const current = windows.get(key);
  if (!current || current.resetAt <= now) {
    windows.set(key, { count: 1, resetAt: now + windowSeconds * 1000 });
    return 'allowed';
  }
  current.count += 1;
  return current.count > maxRequests ? 'limited' : 'allowed';
}

export function resetRateLimits(): void {
  windows.clear();
}

// Pass `scope` when the matched route path is shared with other handlers
// (for example wildcard middleware), so the counter stays per endpoint.
export function rateLimit(
  maxRequests: number,
  windowSeconds: number,
  scope?: string,
): MiddlewareHandler<AppEnv> {
  return async (c, next) => {
    if (consumeRateLimit(c, maxRequests, windowSeconds, scope) === 'limited')
      return c.json(
        apiError('RATE_LIMITED', 'Trop de requêtes, réessayez plus tard'),
        429,
      );
    await next();
  };
}
