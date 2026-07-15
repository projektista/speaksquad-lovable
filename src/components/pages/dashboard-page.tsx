import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/app-shell";
import { Reveal } from "@/components/fx/reveal";
import type { DashboardContent, Lang } from "@/lib/i18n";
import { getMyOverview } from "@/lib/booking.functions";

function formatDateTime(iso: string, lang: Lang) {
  const d = new Date(iso);
  const locale = lang === "jp" ? "ja-JP" : "pt-BR";
  const date = d.toLocaleDateString(locale, {
    weekday: "short",
    day: "2-digit",
    month: "short",
    timeZone: "Asia/Tokyo",
  });
  const time = d.toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Tokyo",
  });
  return { date, time };
}

export function DashboardPage({ content, lang }: { content: DashboardContent; lang: Lang }) {
  const p = (path: string) => (lang === "jp" ? `/jp${path}` : path);
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard-overview"],
    queryFn: () => getMyOverview(),
  });

  const available = data?.available ?? 0;
  const totalCompleted = data?.totalCompleted ?? 0;
  const next = data?.nextLesson ?? null;
  const nextFmt = next ? formatDateTime(next.scheduled_at, lang) : null;

  return (
    <AppShell lang={lang} title={content.title} subtitle={content.subtitle} credits={available}>
      <div className="grid gap-4 md:grid-cols-3">
        <Reveal>
          <div className="card-hair p-5">
            <div className="font-mono-alt text-xs text-muted">{content.creditsLabel}</div>
            <div className="mt-2 font-display text-4xl text-cyan">
              {isLoading ? "—" : available}
            </div>
            <Link to={p("/credits")} className="btn-outline mt-4 w-full !py-2 text-xs">
              {content.buyMore}
            </Link>
          </div>
        </Reveal>
        <Reveal delay={80}>
          <div className="card-hair p-5">
            <div className="font-mono-alt text-xs text-muted">{content.nextLessonLabel}</div>
            {next && nextFmt ? (
              <>
                <div className="mt-2 font-display text-lg">{nextFmt.date}</div>
                <div className="font-mono-alt text-sm text-cyan">{nextFmt.time} JST</div>
                <div className="mt-1 font-mono-alt text-xs text-muted capitalize">
                  {next.mode}
                </div>
                <Link
                  to={p(`/lessons/${next.id}`)}
                  className="btn-outline mt-4 w-full !py-2 text-xs"
                >
                  {content.seeDetails}
                </Link>
              </>
            ) : (
              <>
                <div className="mt-2 font-mono-alt text-sm text-muted">
                  {lang === "jp" ? "予約なし" : "Nenhuma aula agendada"}
                </div>
                <Link to={p("/schedule")} className="btn-outline mt-4 w-full !py-2 text-xs">
                  {content.scheduleCta}
                </Link>
              </>
            )}
          </div>
        </Reveal>
        <Reveal delay={160}>
          <div className="card-hair p-5">
            <div className="font-mono-alt text-xs text-muted">{content.totalLabel}</div>
            <div className="mt-2 font-display text-4xl">
              {isLoading ? "—" : totalCompleted}
            </div>
            <Link to={p("/lessons")} className="btn-outline mt-4 w-full !py-2 text-xs">
              {content.history}
            </Link>
          </div>
        </Reveal>
      </div>

      <Reveal delay={200}>
        <div className="card-hair mt-8 flex flex-col items-start justify-between gap-4 p-6 md:flex-row md:items-center">
          <div>
            <div className="section-label">{content.nextStepCode}</div>
            <h2 className="mt-2 font-display text-xl">{content.nextStepTitle}</h2>
            <p className="mt-1 text-sm text-muted">{content.nextStepLead}</p>
          </div>
          <Link to={p("/schedule")} className="btn-primary">
            {content.scheduleCta}
          </Link>
        </div>
      </Reveal>
    </AppShell>
  );
}