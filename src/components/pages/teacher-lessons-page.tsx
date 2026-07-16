import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/app-shell";
import { getTeacherAllLessons } from "@/lib/teacher.functions";

export function TeacherLessonsPage() {
  const [lessons, setLessons] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    getTeacherAllLessons().then(setLessons);
  }, []);

  const filtered = filter === "all" ? lessons : lessons.filter((l) => l.status === filter);

  return (
    <AppShell lang="pt" title="Todas as aulas" subtitle="Histórico completo.">
      <div className="mb-4 flex gap-2 font-mono-alt text-xs">
        {["all", "scheduled", "completed", "student_cancelled", "teacher_cancelled", "no_show", "late_cancel"].map(
          (s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`btn-outline !py-1 !px-2 ${filter === s ? "border-cyan text-cyan" : ""}`}
            >
              {s}
            </button>
          ),
        )}
      </div>
      <div className="card-hair overflow-x-auto">
        <table className="w-full font-mono-alt text-xs">
          <thead>
            <tr className="border-b border-hair text-muted">
              <th className="p-2 text-left">quando</th>
              <th className="p-2 text-left">modo</th>
              <th className="p-2 text-left">status</th>
              <th className="p-2 text-left">aluno</th>
              <th className="p-2 text-left"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((l) => (
              <tr key={l.id} className="border-b border-hair last:border-0">
                <td className="p-2">
                  {new Date(l.scheduled_at).toLocaleString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className="p-2 capitalize">{l.mode}</td>
                <td className="p-2">{l.status}</td>
                <td className="p-2 text-muted">{l.student_id.slice(0, 8)}</td>
                <td className="p-2">
                  <Link to="/lessons/$id" params={{ id: l.id }} className="text-cyan hover:underline">
                    abrir
                  </Link>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-muted">
                  Nenhuma aula com esse filtro.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}