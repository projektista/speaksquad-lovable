import { useState } from "react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { SectionLabel } from "@/components/fx/section-label";
import { Reveal } from "@/components/fx/reveal";
import { BracketFrame } from "@/components/fx/bracket-frame";
import { ParticleField } from "@/components/fx/particle-field";
import type { ContactContent, Lang } from "@/lib/i18n";

export function ContactPage({ content, lang }: { content: ContactContent; lang: Lang }) {
  const [sent, setSent] = useState(false);
  const [w1, w2, w3, w4] = content.titleParts;

  return (
    <div className="min-h-screen bg-bg text-foreground" lang={lang === "jp" ? "ja" : "pt-BR"}>
      <SiteHeader lang={lang} />
      <section className="section-glow-cyan hero-aurora bg-noise relative overflow-hidden">
        <ParticleField density={28} />
        <div className="relative mx-auto max-w-5xl px-5 py-16 md:py-24">
          <Reveal variant="fade">
            <SectionLabel n={content.sectionCode}>{content.sectionLabel}</SectionLabel>
          </Reveal>
          <Reveal delay={80} variant="clip">
            <h1 className="glitch-rgb mt-4 font-display text-4xl leading-[1.05] md:text-6xl">
              <span style={{ color: "#f7fafc" }}>{w1}</span>{" "}
              <span style={{ color: "#00d9ff" }}>{w2}</span>{" "}
              <span style={{ color: "#ff006e" }}>{w3}</span>
              {w4}
            </h1>
          </Reveal>
          <Reveal delay={140} variant="fade-up">
            <p className="mt-6 max-w-xl text-soft">{content.lead}</p>
          </Reveal>

          <div className="mt-12 grid gap-8 md:grid-cols-[1fr_320px]">
            <Reveal delay={160} variant="slide-left">
              <BracketFrame className="card-tilt p-6">
                {sent ? (
                  <div className="py-8 text-center font-mono-alt text-sm text-success">
                    {content.sentMsg}
                  </div>
                ) : (
                  <form
                    className="space-y-4"
                    onSubmit={(e) => {
                      e.preventDefault();
                      setSent(true);
                    }}
                  >
                    <label className="block">
                      <span className="font-mono-alt text-xs uppercase tracking-widest text-muted">
                        {content.fields.name}
                      </span>
                      <input
                        required
                        className="mt-2 w-full rounded-[4px] border border-hair bg-bg2 px-3 py-2 font-mono-alt text-sm text-foreground outline-none focus:border-cyan"
                        placeholder={content.fields.namePlaceholder}
                      />
                    </label>
                    <label className="block">
                      <span className="font-mono-alt text-xs uppercase tracking-widest text-muted">
                        {content.fields.email}
                      </span>
                      <input
                        type="email"
                        required
                        className="mt-2 w-full rounded-[4px] border border-hair bg-bg2 px-3 py-2 font-mono-alt text-sm text-foreground outline-none focus:border-cyan"
                        placeholder={content.fields.emailPlaceholder}
                      />
                    </label>
                    <label className="block">
                      <span className="font-mono-alt text-xs uppercase tracking-widest text-muted">
                        {content.fields.subject}
                      </span>
                      <input
                        className="mt-2 w-full rounded-[4px] border border-hair bg-bg2 px-3 py-2 font-mono-alt text-sm text-foreground outline-none focus:border-cyan"
                        placeholder={content.fields.subjectPlaceholder}
                      />
                    </label>
                    <label className="block">
                      <span className="font-mono-alt text-xs uppercase tracking-widest text-muted">
                        {content.fields.message}
                      </span>
                      <textarea
                        required
                        rows={6}
                        className="mt-2 w-full resize-y rounded-[4px] border border-hair bg-bg2 px-3 py-2 font-mono-alt text-sm text-foreground outline-none focus:border-cyan"
                        placeholder={content.fields.messagePlaceholder}
                      />
                    </label>
                    <button type="submit" className="btn-primary btn-shine w-full justify-center">
                      {content.submit}
                    </button>
                  </form>
                )}
              </BracketFrame>
            </Reveal>

            <Reveal delay={220} variant="slide-right">
              <div className="space-y-6 font-mono-alt text-sm">
                <div className="card-hair card-tilt p-5">
                  <div className="text-xs uppercase tracking-widest text-violet">{content.info.emailLabel}</div>
                  <div className="mt-2 break-all text-soft">contato@speaksquad.jp</div>
                </div>
                <div className="card-hair card-tilt p-5">
                  <div className="text-xs uppercase tracking-widest text-violet">{content.info.hoursLabel}</div>
                  <div className="mt-2 text-soft">{content.info.hoursValue}</div>
                </div>
                <div className="card-hair card-tilt p-5">
                  <div className="text-xs uppercase tracking-widest text-violet">{content.info.baseLabel}</div>
                  <div className="mt-2 text-soft">{content.info.baseValue}</div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
      <SiteFooter lang={lang} />
    </div>
  );
}