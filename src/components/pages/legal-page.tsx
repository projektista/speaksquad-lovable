import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { SectionLabel } from "@/components/fx/section-label";
import type { Lang } from "@/lib/i18n";
import type { LegalContent } from "@/lib/legal-content";

/**
 * Document-style layout for legal pages (privacy, terms). Deliberately calmer
 * than the landing: no particles/glitch, generous line-height, readable measure.
 */
export function LegalPage({ content, lang }: { content: LegalContent; lang: Lang }) {
  return (
    <div className="min-h-screen bg-bg text-foreground" lang={lang === "jp" ? "ja" : "pt-BR"}>
      <SiteHeader lang={lang} />
      <main className="mx-auto max-w-3xl px-5 py-14 md:py-20">
        <SectionLabel n={content.sectionCode}>{content.sectionLabel}</SectionLabel>
        <h1 className="mt-4 font-display text-3xl leading-tight md:text-4xl">{content.title}</h1>
        <p className="mt-3 font-mono-alt text-xs uppercase tracking-widest text-muted">
          {content.updatedLabel}: {content.updatedAt}
        </p>

        <p className="mt-8 text-base leading-relaxed text-soft">{content.intro}</p>

        <div className="mt-10 space-y-10">
          {content.sections.map((s) => (
            <section key={s.heading}>
              <h2 className="font-display text-xl text-foreground md:text-2xl">{s.heading}</h2>
              <div className="mt-3 space-y-4">
                {s.body.map((p, i) => (
                  <p key={i} className="text-base leading-relaxed text-soft">
                    {p}
                  </p>
                ))}
              </div>
              {s.bullets && s.bullets.length > 0 && (
                <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-relaxed text-soft">
                  {s.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </main>
      <SiteFooter lang={lang} />
    </div>
  );
}