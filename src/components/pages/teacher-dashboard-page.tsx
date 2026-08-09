import { useCallback, useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/app-shell";
import { Reveal } from "@/components/fx/reveal";
import { getTeacherOverview } from "@/lib/teacher.functions";
import { lessonStatusLabel } from "@/lib/i18n";
import { trackLoadError, trackLoadStart, trackLoadSuccess } from "@/lib/telemetry";

type Overview = Awaited<ReturnType<typeof getTeacherOverview>>;

export function TeacherDashboardPage() {
  const [data, setData] = useState<Overview | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setErr(null);
    const startedAt = trackLoadStart("teacher-dashboard");
    try {
      setData(await getTeacherOverview());
      trackLoadSuccess("teacher-dashboard", startedAt);
    } catch (e: any) {
      setData(null);
      setErr(e?.message ?? String(e));
      trackLoadError("teacher-dashboard", e, { source: "getTeacherOverview" }, startedAt);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <AppShell lang="pt" title="Dashboard do Professor" subtitle="Sua visão geral como Hugo.">
      <div className="flex flex-col gap-6">
        {[
          { title: "Hoje", items: data?.today, empty: "Nenhuma aula hoje." },
          { title: "Próximas", items: data?.upcoming, empty: "Sem próximas aulas." },
          { title: "Últimas 5", items: data?.recent, empty: "Sem aulas recentes." },
        ].map((s, i) => (
          <Reveal key={s.title} delay={i * 80}>
            <Section
              title={s.title}
              items={s.items}
              loading={loading}
              error={err}
              onRetry={load}
              empty={s.empty}
            />
          </Reveal>
        ))}
      </div>
    </AppShell>
  );
}

function Section({
  title,
  items,
  empty,
  loading,
  error,
  onRetry,
}: {
  title: string;
  items?: any[];
  empty: string;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}) {
  return (
    <div className="card-hair card-lift p-4">
      <div className="mb-3 font-mono-alt text-[11px] uppercase tracking-widest text-magenta">
        // {title.toLowerCase()}
      </div>
      {loading && (
        <div className="space-y-2" aria-busy="true" aria-live="polite">
          {[0, 1, 2].map((i) => (
            <div key={i} className="border-b border-hair pb-2 last:border-0">
              <div className="h-3 w-32 animate-pulse rounded bg-[color:var(--hair)]" />
              <div className="mt-2 h-3 w-24 animate-pulse rounded bg-[color:var(--hair)]" />
            </div>
          ))}
          <span className="sr-only">carregando...</span>
        </div>
      )}
      {!loading && error && (
        <div
          role="alert"
          className="flex flex-col items-start gap-3 rounded-[var(--radius)] border border-[color:var(--magenta)]/50 bg-[color:var(--magenta)]/10 p-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="min-w-0">
            <div className="text-sm text-magenta">Não foi possível carregar esta seção.</div>
            <div className="mt-1 font-mono-alt text-[11px] break-words text-muted">{error}</div>
          </div>
          <button type="button" onClick={onRetry} className="btn-outline press !py-2 text-xs">
            Tentar novamente
          </button>
        </div>
      )}
      {!loading && !error && (items?.length ?? 0) === 0 && (
        <div className="text-sm text-muted">{empty}</div>
      )}
      <ul className="space-y-2">
        {!loading && !error &&
          (items ?? []).map((l) => (
          <li key={l.id} className="border-b border-hair pb-2 last:border-0">
            <Link
              to="/ptbr/lessons/$id"
              params={{ id: l.id }}
              className="block rounded-[var(--radius)] px-2 py-1 -mx-2 transition-all duration-200 hover:translate-x-1 hover:bg-[color:var(--cyan)]/8 hover:text-cyan"
            >
              <div className="font-mono-alt text-xs text-muted">
                {new Date(l.scheduled_at).toLocaleString("pt-BR", {
                  weekday: "short",
                  day: "2-digit",
                  month: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
              <div className="text-sm capitalize">
                {l.mode} · <span className="text-muted">{lessonStatusLabel(l.status, "pt")}</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}