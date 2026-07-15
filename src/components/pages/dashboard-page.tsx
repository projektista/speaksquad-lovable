import { Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/app-shell";
import { Reveal } from "@/components/fx/reveal";
import type { DashboardContent, Lang } from "@/lib/i18n";

export function DashboardPage({ content, lang }: { content: DashboardContent; lang: Lang }) {
  const p = (path: string) => (lang === "jp" ? `/jp${path}` : path);
  return (
    <AppShell lang={lang} title={content.title} subtitle={content.subtitle} credits={3}>
      <div className="grid gap-4 md:grid-cols-3">
        <Reveal>
          <div className="card-hair p-5">
            <div className="font-mono-alt text-xs text-muted">{content.creditsLabel}</div>
            <div className="mt-2 font-display text-4xl text-cyan">3</div>
            <Link to={p("/credits")} className="btn-outline mt-4 w-full !py-2 text-xs">
              {content.buyMore}
            </Link>
          </div>
        </Reveal>
        <Reveal delay={80}>
          <div className="card-hair p-5">
            <div className="font-mono-alt text-xs text-muted">{content.nextLessonLabel}</div>
            <div className="mt-2 font-display text-lg">{content.nextLessonDate}</div>
            <div className="font-mono-alt text-sm text-cyan">18:00 JST</div>
            <div className="mt-1 font-mono-alt text-xs text-muted">{content.nextLessonMode}</div>
            <Link to={p("/schedule")} className="btn-outline mt-4 w-full !py-2 text-xs">
              {content.seeDetails}
            </Link>
          </div>
        </Reveal>
        <Reveal delay={160}>
          <div className="card-hair p-5">
            <div className="font-mono-alt text-xs text-muted">{content.totalLabel}</div>
            <div className="mt-2 font-display text-4xl">12</div>
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