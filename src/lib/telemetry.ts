// Lightweight client-side error logging + failure metrics for dashboard loads.
// Keeps a rolling in-memory record so failures can be inspected during debugging
// (window.__speaksquadMetrics) and forwards errors to the platform reporter.
import { reportAppError } from "./error-reporting";

export type LoadScope = "student-dashboard" | "teacher-dashboard" | string;

type ScopeMetrics = {
  attempts: number;
  failures: number;
  successes: number;
  lastErrorMessage?: string;
  lastErrorAt?: string;
  lastDurationMs?: number;
};

const metrics = new Map<LoadScope, ScopeMetrics>();
const MAX_EVENTS = 25;
const events: Array<{ scope: LoadScope; message: string; at: string; durationMs?: number }> = [];

function bucket(scope: LoadScope): ScopeMetrics {
  let m = metrics.get(scope);
  if (!m) {
    m = { attempts: 0, failures: 0, successes: 0 };
    metrics.set(scope, m);
  }
  return m;
}

function expose() {
  if (typeof window === "undefined") return;
  (window as any).__speaksquadMetrics = { scopes: snapshotMetrics(), events: [...events] };
}

export function snapshotMetrics(): Record<string, ScopeMetrics> {
  return Object.fromEntries([...metrics.entries()].map(([k, v]) => [k, { ...v }]));
}

export function trackLoadStart(scope: LoadScope) {
  bucket(scope).attempts += 1;
  expose();
  return Date.now();
}

export function trackLoadSuccess(scope: LoadScope, startedAt?: number) {
  const m = bucket(scope);
  m.successes += 1;
  if (startedAt) m.lastDurationMs = Date.now() - startedAt;
  expose();
}

export function trackLoadError(
  scope: LoadScope,
  error: unknown,
  context: Record<string, unknown> = {},
  startedAt?: number,
) {
  const message = error instanceof Error ? error.message : String(error);
  const at = new Date().toISOString();
  const durationMs = startedAt ? Date.now() - startedAt : undefined;

  const m = bucket(scope);
  m.failures += 1;
  m.lastErrorMessage = message;
  m.lastErrorAt = at;
  if (durationMs !== undefined) m.lastDurationMs = durationMs;

  events.unshift({ scope, message, at, durationMs });
  if (events.length > MAX_EVENTS) events.pop();
  expose();

  console.error(`[load-error] ${scope}: ${message}`, {
    ...context,
    durationMs,
    failures: m.failures,
    attempts: m.attempts,
  });

  reportAppError(error, { scope, failures: m.failures, attempts: m.attempts, ...context });
  }
