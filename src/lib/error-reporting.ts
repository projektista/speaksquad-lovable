// Client-side error reporting hook. Currently logs to the console;
// swap this out if/when a dedicated error-tracking service is wired up.
export function reportAppError(error: unknown, context: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  console.error("[app-error]", error, context);
}
