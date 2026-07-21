import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/app-shell";
import { getMyLessons } from "@/lib/booking.functions";
import type { Lang, LessonsListContent } from "@/lib/i18n";

type Lesson = {
  id: string;
  scheduled_at: string;
  mode: string;
  status: string;
  meet_url: string | null;
};

export function LessonsListPage({ content, lang }: { content: LessonsListContent; lang: Lang }) {
  const p = (path: string) => (lang === "jp" ? path : `/ptbr${path}`);
  const [lessons, setLessons] = useState<Lesson[] | null>(null);
  const [filter, setFilter] = useState<"all" | "upcoming" | "past">("upcoming");
  const locale = lang === "jp" ? "ja-JP" : "pt-BR";

  useEffect(() => {
    getMyLessons().then((rows) => setLessons(rows as Lesson[]));
  }, []);

  const filtered = useMemo(() => {
    if (!lessons) return [];
    const now = Date.now();
    if (filter === "upcoming")
      return lessons.filter((l) => l.status === "scheduled" && new Date(l.scheduled_at).getTime() >= now);
    if (filter === "past")
      return lessons.filter((l) => l.status !== "scheduled" || new Date(l.scheduled_at).getTime() < now);
    return lessons;
  }, [lessons, filter]);

  return (
    <AppShell lang={lang} title={content.title} subtitle={content.subtitle}>
      <div className="mb-4 flex flex-wrap gap-2 font-mono-alt text-xs">
        {(
          [
            ["upcoming", content.filterUpcoming],
            ["past", content.filterPast],
            ["all", content.filterAll],
          ] as const
        ).map(([k, l]) => (
          <button
            key={k}
            onClick={() => setFilter(k)}
            className={`rounded border px-3 py-1 transition-colors ${
              filter === k
                ? "border-cyan text-cyan bg-[color:var(--bg3)]"
                : "border-hair text-muted hover:text-foreground"
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      {lessons === null && <div className="text-muted">...</div>}

      {lessons && filtered.length === 0 && (
        <div className="card-hair p-6 text-sm text-muted">
          <div>{content.empty}</div>
          <Link to={p("/schedule")} className="btn-primary mt-4 inline-flex">
            {content.scheduleCta}
          </Link>
        </div>
      )}

      {filtered.length > 0 && (
        <ul className="space-y-2">
          {filtered.map((l) => (
            <li key={l.id}>
              <Link
                to={p(`/lessons/${l.id}`)}
                className="card-hair flex items-center justify-between p-4 transition-colors hover:border-cyan"
              >
                <div>
                  <div className="font-mono-alt text-xs text-muted">
                    {new Date(l.scheduled_at).toLocaleString(locale, {
                      weekday: "short",
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                      timeZone: "Asia/Tokyo",
                    })}
                  </div>
                  <div className="mt-1 text-sm capitalize">
                    {l.mode} ·{" "}
                    <span className="text-muted">
                      {content.statusLabels[l.status] ?? l.status}
                    </span>
                  </div>
                </div>
                <span className="font-mono-alt text-xs text-cyan">{content.open} →</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </AppShell>
  );
}