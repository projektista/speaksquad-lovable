import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/app-shell";
import { getTeacherOverview } from "@/lib/teacher.functions";
import { lessonStatusLabel } from "@/lib/i18n";

type Overview = Awaited<ReturnType<typeof getTeacherOverview>>;

export function TeacherDashboardPage() {
  const [data, setData] = useState<Overview | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    getTeacherOverview()
      .then(setData)
      .catch((e) => setErr(e.message ?? String(e)));
  }, []);

  return (
    <AppShell lang="pt" title="Dashboard do Professor" subtitle="Sua visão geral como Hugo.">
      {err && <div className="card-hair p-4 text-magenta">{err}</div>}
      {!err && (
        <div className="flex flex-col gap-6">
          <Section
            title="Hoje"
            items={data?.today}
            loading={!data}
            empty="Nenhuma aula hoje."
          />
          <Section
            title="Próximas"
            items={data?.upcoming}
            loading={!data}
            empty="Sem próximas aulas."
          />
          <Section
            title="Últimas 5"
            items={data?.recent}
            loading={!data}
            empty="Sem aulas recentes."
          />
        </div>
      )}
    </AppShell>
  );
}

function Section({
  title,
  items,
  empty,
  loading,
}: {
  title: string;
  items?: any[];
  empty: string;
  loading?: boolean;
}) {
  return (
    <div className="card-hair p-4">
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
      {!loading && (items?.length ?? 0) === 0 && (
        <div className="text-sm text-muted">{empty}</div>
      )}
      <ul className="space-y-2">
        {!loading &&
          (items ?? []).map((l) => (
          <li key={l.id} className="border-b border-hair pb-2 last:border-0">
            <Link to="/lessons/$id" params={{ id: l.id }} className="block hover:text-cyan">
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