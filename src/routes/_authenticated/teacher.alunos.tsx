import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { listStudents } from "@/lib/teacher.functions";

type Row = Awaited<ReturnType<typeof listStudents>>[number];

export const Route = createFileRoute("/_authenticated/teacher/alunos")({
  component: TeacherStudentsPage,
});

function TeacherStudentsPage() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [q, setQ] = useState("");

  useEffect(() => {
    listStudents()
      .then(setRows)
      .catch((e) => setErr(e.message ?? String(e)));
  }, []);

  const filtered = (rows ?? []).filter((r) => {
    if (!q.trim()) return true;
    const s = q.toLowerCase();
    return (
      r.name.toLowerCase().includes(s) || r.email.toLowerCase().includes(s)
    );
  });

  return (
    <AppShell lang="pt" title="Alunos" subtitle="Gestão de alunos e créditos.">
      {err && <div className="card-hair p-4 text-magenta">{err}</div>}
      {!rows && !err && <div className="text-muted">carregando...</div>}
      {rows && (
        <div className="space-y-4">
          <input
            className="w-full rounded-[4px] border border-hair bg-bg2 px-3 py-2 font-mono-alt text-sm outline-none focus:border-magenta"
            placeholder="Buscar por nome ou e-mail..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <div className="card-hair overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-bg2 font-mono-alt text-[11px] uppercase tracking-widest text-muted">
                <tr>
                  <th className="px-3 py-2 text-left">Nome</th>
                  <th className="px-3 py-2 text-left">E-mail</th>
                  <th className="px-3 py-2 text-right">Créditos</th>
                  <th className="px-3 py-2 text-left">Última aula</th>
                  <th className="px-3 py-2 text-left">Perfil</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id} className="border-t border-hair hover:bg-bg2">
                    <td className="px-3 py-2">
                      <Link
                        to="/teacher/alunos/$id"
                        params={{ id: r.id }}
                        className="hover:text-cyan"
                      >
                        {r.name || <span className="text-muted">—</span>}
                      </Link>
                    </td>
                    <td className="px-3 py-2 text-muted">{r.email || "—"}</td>
                    <td className="px-3 py-2 text-right font-mono-alt">
                      {r.available}
                      {r.reserved > 0 && (
                        <span className="ml-1 text-xs text-muted">
                          (+{r.reserved} res.)
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-muted">
                      {r.lastCompletedAt
                        ? new Date(r.lastCompletedAt).toLocaleDateString("pt-BR")
                        : "—"}
                    </td>
                    <td className="px-3 py-2">
                      {r.profileComplete ? (
                        <span className="text-cyan text-xs">completo</span>
                      ) : (
                        <span className="text-magenta text-xs">incompleto</span>
                      )}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-3 py-6 text-center text-muted">
                      Nenhum aluno encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AppShell>
  );
}