import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/app-shell";
import { getTeacherOverview } from "@/lib/teacher.functions";

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
      {!data && !err && <div className="text-muted">carregando...</div>}
      {data && (
        <div className="grid gap-6 md:grid-cols-3">
          <Section title="Hoje" items={data.today} empty="Nenhuma aula hoje." />
          <Section title="Próximas" items={data.upcoming} empty="Sem próximas aulas." />
          <Section title="Últimas 5" items={data.recent} empty="Sem aulas recentes." />
        </div>
      )}
    </AppShell>
  );
}

function Section({ title, items, empty }: { title: string; items: any[]; empty: string }) {
  return (
    <div className="card-hair p-4">
      <div className="mb-3 font-mono-alt text-[11px] uppercase tracking-widest text-magenta">
        // {title.toLowerCase()}
      </div>
      {items.length === 0 && <div className="text-sm text-muted">{empty}</div>}
      <ul className="space-y-2">
        {items.map((l) => (
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
                {l.mode} · <span className="text-muted">{l.status}</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}