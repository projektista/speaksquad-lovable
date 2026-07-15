import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { SectionLabel } from "@/components/fx/section-label";
import { TypingText } from "@/components/fx/typing-text";
import { Reveal } from "@/components/fx/reveal";
import { ParticleField } from "@/components/fx/particle-field";
import { BracketFrame } from "@/components/fx/bracket-frame";
import { GlitchText } from "@/components/fx/glitch-text";
import { ScrambleText } from "@/components/fx/scramble-text";
import type { LandingContent } from "./landing-content";
import { useLangAutoDetect } from "@/lib/i18n";

const COLOR: Record<"white" | "cyan" | "magenta", string> = {
  white: "#f7fafc",
  cyan: "#00d9ff",
  magenta: "#ff006e",
};

function ColoredTitle({
  parts,
}: {
  parts: { text: string; color: "white" | "cyan" | "magenta" }[];
}) {
  return (
    <>
      {parts.map((p, i) => {
        if (p.text.includes("\n")) {
          const [before, after] = p.text.split("\n");
          return (
            <span key={i} style={{ color: COLOR[p.color] }}>
              {before}
              <br />
              {after}
            </span>
          );
        }
        return (
          <span key={i} style={{ color: COLOR[p.color] }}>
            {p.text}
          </span>
        );
      })}
    </>
  );
}

export function LandingPage({
  content,
  lang,
}: {
  content: LandingContent;
  lang: "pt" | "jp";
}) {
  useLangAutoDetect();
  return (
    <div className="min-h-screen bg-bg text-foreground" lang={content.htmlLang}>
      <SiteHeader lang={lang} />
      <Hero content={content} />
      <Metodo content={content} />
      <Features content={content} />
      <Fluxo content={content} />
      <Gratis content={content} />
      <Pricing content={content} />
      <Requisitos content={content} />
      <Sobre content={content} />
      <CTA content={content} />
      <FAQ content={content} />
      <SiteFooter lang={lang} />
    </div>
  );
}

function Hero({ content }: { content: LandingContent }) {
  const { hero, signupPath } = content;
  return (
    <section id="hero" className="hero-aurora bg-noise relative overflow-hidden">
      <ParticleField density={36} />
      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-5 pb-16 pt-14 md:grid-cols-[1.2fr_0.8fr] md:pb-24 md:pt-20">
        <div>
          <SectionLabel n="00">
            <span className="text-magenta">&gt;_</span> {hero.label}
          </SectionLabel>
          <h1 className="glitch-rgb mt-5 font-display text-4xl leading-[1.05] md:text-6xl">
            <span className="ss-clip-reveal block" style={{ color: COLOR.white }}>
              {hero.titleLine1}
            </span>
            <span className="block">
              <span style={{ color: COLOR.cyan }}>{hero.titleWord1}</span>{" "}
              <span style={{ color: COLOR.magenta }}>
                <TypingText text={hero.typingText} speed={hero.typingSpeed} startDelay={350} />
              </span>
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-soft">{hero.lead}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link to={signupPath} className="btn-primary btn-shine">
              {hero.ctaPrimary}
            </Link>
            <a href="#method" className="btn-outline">
              {hero.ctaSecondary}
            </a>
          </div>
          <p className="mt-4 flex items-center gap-2 font-mono-alt text-xs text-muted">
            <span className="text-success">✓</span> {hero.noCard}
          </p>
          <div className="mt-8 flex flex-wrap gap-2 font-mono-alt text-xs">
            {hero.tags.map((t) => (
              <span key={t} className="rounded-[4px] border-hair bg-bg2 px-2.5 py-1 text-soft">
                {t}
              </span>
            ))}
          </div>
        </div>

        <BracketFrame className="card-tilt relative p-5">
          <div className="section-label mb-4">{hero.sideLabel}</div>
          <div className="space-y-4 font-mono-alt">
            {hero.stats.map((s, i) => (
              <Reveal
                key={s.v}
                delay={i * 80}
                className="flex items-baseline justify-between border-b border-hair pb-3"
              >
                <span className="font-display text-2xl text-cyan md:text-3xl">{s.v}</span>
                <span className="text-xs text-muted">{s.l}</span>
              </Reveal>
            ))}
          </div>
          <div className="mt-6 flex items-center justify-between">
            <span className="font-mono-alt text-[10px] uppercase tracking-widest text-muted">
              // status
            </span>
            <span className="badge-pulse">▊ online</span>
          </div>
        </BracketFrame>
      </div>
      <div className="hair-divider mx-auto max-w-6xl" />
    </section>
  );
}

function Metodo({ content }: { content: LandingContent }) {
  const { metodo } = content;
  return (
    <section
      id="method"
      className="section-glow-cyan bg-grid-parallax relative mx-auto max-w-6xl px-5 py-20"
    >
      <Reveal>
        <SectionLabel n={metodo.sectionN}>{metodo.label}</SectionLabel>
      </Reveal>
      <Reveal delay={80} variant="clip">
        <h2 className="glitch-rgb mt-4 max-w-3xl font-display text-3xl md:text-5xl">
          <ColoredTitle parts={metodo.titleParts} />
        </h2>
      </Reveal>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Reveal delay={120} variant="slide-left">
          <p className="text-soft">{metodo.p1}</p>
        </Reveal>
        <Reveal delay={200} variant="slide-right">
          <p className="text-soft">{metodo.p2}</p>
        </Reveal>
      </div>
      <ParticleField density={18} className="opacity-60" />
    </section>
  );
}

function Features({ content }: { content: LandingContent }) {
  const { features } = content;
  return (
    <section
      id="features"
      className="section-glow-magenta section-scanlines bg-noise border-t border-hair bg-bg2/40"
    >
      <div className="mx-auto max-w-6xl px-5 py-20">
        <Reveal>
          <SectionLabel n={features.sectionN}>{features.label}</SectionLabel>
        </Reveal>
        <Reveal delay={80} variant="clip">
          <h2 className="glitch-rgb mt-4 max-w-3xl font-display text-3xl md:text-5xl">
            <ColoredTitle parts={features.titleParts} />
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {features.items.map((f, i) => (
            <Reveal key={f.t} delay={i * 60} variant="parallax">
              <div className="card-hair card-tilt h-full p-6">
                <div className="font-mono-alt text-xs text-muted">0{i + 1}</div>
                <h3 className="mt-2 font-display text-lg text-foreground">
                  <GlitchText>{f.t}</GlitchText>
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-soft">{f.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Fluxo({ content }: { content: LandingContent }) {
  const { fluxo } = content;
  return (
    <section
      id="flow"
      className="section-glow-violet bg-grid-parallax mx-auto max-w-6xl px-5 py-20"
    >
      <Reveal>
        <SectionLabel n={fluxo.sectionN}>{fluxo.label}</SectionLabel>
      </Reveal>
      <Reveal delay={80} variant="clip">
        <h2 className="glitch-rgb mt-4 max-w-3xl font-display text-3xl md:text-5xl">
          <ColoredTitle parts={fluxo.titleParts} />
        </h2>
      </Reveal>
      <p className="mt-4 max-w-2xl text-soft">{fluxo.intro}</p>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {fluxo.items.map((f, i) => (
          <Reveal key={f.n} delay={i * 100} variant="parallax">
            <div className="card-hair card-tilt relative h-full overflow-hidden p-6">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-2 -top-6 font-display text-[6rem] leading-none text-[color:var(--bg3)]"
              >
                {f.n}
              </div>
              <div className="relative">
                <div className="font-mono-alt text-xs text-violet">
                  {fluxo.partWord} {f.n}
                </div>
                <h3 className="mt-2 font-display text-xl text-cyan">{f.t}</h3>
                <p className="mt-3 text-sm leading-relaxed text-soft">{f.d}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Gratis({ content }: { content: LandingContent }) {
  const { gratis } = content;
  return (
    <section
      id="how"
      className="section-glow-cyan section-scanlines bg-noise border-t border-hair bg-bg2/40"
    >
      <div className="mx-auto max-w-6xl px-5 py-20">
        <Reveal>
          <SectionLabel n={gratis.sectionN}>{gratis.label}</SectionLabel>
        </Reveal>
        <Reveal delay={80} variant="clip">
          <h2 className="glitch-rgb mt-4 max-w-3xl font-display text-3xl md:text-5xl">
            <ColoredTitle parts={gratis.titleParts} />
          </h2>
        </Reveal>
        <Reveal delay={140}>
          <div className="mt-6 flex items-center gap-3 rounded-[4px] border border-[color:var(--success)]/40 bg-[color:color-mix(in_oklab,var(--success)_10%,transparent)] px-4 py-3 font-mono-alt text-sm text-soft">
            <span className="text-success">✓</span>
            {gratis.banner}
          </div>
        </Reveal>
        <div className="mt-10 grid gap-4 md:grid-cols-4">
          {gratis.steps.map((p, i) => (
            <Reveal key={p.n} delay={i * 80} variant="parallax">
              <div className="card-hair card-tilt h-full p-5">
                <div className="font-mono-alt text-[11px] tracking-widest text-violet">{p.n}</div>
                <h3 className="mt-2 font-display text-lg text-cyan">{p.t}</h3>
                <p className="mt-2 text-sm text-soft">{p.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing({ content }: { content: LandingContent }) {
  const { pricing, signupPath } = content;
  return (
    <section
      id="pricing"
      className="section-glow-magenta bg-grid-parallax relative mx-auto max-w-6xl px-5 py-20"
    >
      <ParticleField density={22} className="opacity-40" />
      <Reveal>
        <SectionLabel n={pricing.sectionN}>{pricing.label}</SectionLabel>
      </Reveal>
      <Reveal delay={80} variant="clip">
        <h2 className="glitch-rgb mt-4 max-w-3xl font-display text-3xl md:text-5xl">
          {pricing.title}
        </h2>
      </Reveal>
      <p className="mt-4 max-w-2xl text-soft">{pricing.intro}</p>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {pricing.tiers.map((p, i) => (
          <Reveal key={p.name} delay={i * 100} variant="parallax">
            <div
              className={`card-hair card-tilt relative flex h-full flex-col p-6 ${
                p.featured ? "border-[color:var(--cyan)]" : ""
              }`}
            >
              {p.featured && (
                <div className="absolute -top-3 left-4 rounded-[3px] border border-[color:var(--magenta)] bg-bg px-2 py-0.5 font-mono-alt text-[10px] uppercase tracking-widest text-magenta">
                  {pricing.popularBadge}
                </div>
              )}
              <div className="font-mono-alt text-xs uppercase tracking-widest text-muted">
                {p.name}
              </div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="font-mono-alt text-4xl font-semibold text-foreground">
                  <span className="text-magenta">¥</span>
                  <ScrambleText text={p.price.replace("¥", "")} duration={800} />
                </span>
              </div>
              <div className="mt-1 text-xs text-muted">
                <span className="text-success">{p.per}</span>
                {p.save && <span className="ml-2 text-magenta">// {p.save}</span>}
              </div>
              <ul className="mt-6 flex-1 space-y-2 font-mono-alt text-sm">
                {p.features.map((it) => (
                  <li key={it} className="flex items-start gap-2 border-b border-hair pb-2">
                    <span className="text-success">✓</span>
                    <span className="text-soft">{it}</span>
                  </li>
                ))}
              </ul>
              <Link
                to={signupPath}
                className={`mt-6 w-full ${p.featured ? "btn-primary btn-shine" : "btn-outline"}`}
              >
                {pricing.buyCta}
              </Link>
              <div className="mt-3 text-center font-mono-alt text-[11px] text-muted">
                {p.footer}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Requisitos({ content }: { content: LandingContent }) {
  const { requisitos } = content;
  return (
    <section
      id="requirements"
      className="section-glow-violet bg-noise border-t border-hair bg-bg2/40"
    >
      <div className="mx-auto max-w-6xl px-5 py-20">
        <Reveal>
          <SectionLabel n={requisitos.sectionN}>{requisitos.label}</SectionLabel>
        </Reveal>
        <Reveal delay={80} variant="clip">
          <h2 className="glitch-rgb mt-4 max-w-3xl font-display text-3xl md:text-5xl">
            {requisitos.titlePrefix}
            <span className="text-cyan">{requisitos.titleHighlight}</span>
            {requisitos.titleSuffix}
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-3 md:grid-cols-2">
          {requisitos.items.map((r, i) => (
            <Reveal
              key={r.t}
              delay={i * 60}
              variant={i % 2 === 0 ? "slide-left" : "slide-right"}
            >
              <div className="card-hair card-tilt flex items-start gap-4 p-5">
                <span className="mt-0.5 font-mono-alt text-xs text-cyan">
                  [{String(i + 1).padStart(2, "0")}]
                </span>
                <div>
                  <div className="font-display text-base">{r.t}</div>
                  <div className="mt-1 font-mono-alt text-xs text-muted">{r.o}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Sobre({ content }: { content: LandingContent }) {
  const { sobre } = content;
  return (
    <section id="about" className="section-glow-cyan mx-auto max-w-6xl px-5 py-20">
      <Reveal>
        <SectionLabel n={sobre.sectionN}>{sobre.label}</SectionLabel>
      </Reveal>
      <div className="mt-6 grid gap-8 md:grid-cols-[280px_1fr] md:gap-12">
        <Reveal>
          <BracketFrame className="p-6 text-center">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border-hair2 bg-bg3 text-4xl">
              🎮
            </div>
            <div className="mt-4 font-display text-xl">Hugo</div>
            <div className="mt-1 font-mono-alt text-xs text-muted">{sobre.role}</div>
            <div className="mt-4 font-mono-alt text-[10px] uppercase tracking-widest text-cyan">
              {sobre.tag}
            </div>
          </BracketFrame>
        </Reveal>
        <Reveal delay={100}>
          <div className="space-y-4 text-soft">
            {sobre.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function CTA({ content }: { content: LandingContent }) {
  const { cta, signupPath } = content;
  return (
    <section
      id="cta"
      className="hero-aurora relative overflow-hidden border-y border-hair bg-bg2/40"
    >
      <ParticleField density={30} />
      <div className="relative mx-auto max-w-4xl px-5 py-24 text-center">
        <Reveal>
          <SectionLabel n={cta.sectionN}>{cta.label}</SectionLabel>
        </Reveal>
        <Reveal delay={80} variant="clip">
          <h2 className="glitch-rgb mt-6 font-display text-3xl md:text-5xl">
            <ColoredTitle parts={cta.titleParts} />
          </h2>
        </Reveal>
        <Reveal delay={140}>
          <p className="mx-auto mt-4 max-w-xl text-soft">{cta.lead}</p>
        </Reveal>
        <Reveal delay={200}>
          <div className="mt-8">
            <Link to={signupPath} className="btn-primary btn-shine">
              {cta.button}
            </Link>
          </div>
        </Reveal>
        <p className="mt-6 font-mono-alt text-xs text-muted">{cta.caption}</p>
      </div>
    </section>
  );
}

function FAQ({ content }: { content: LandingContent }) {
  const { faq } = content;
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section
      id="faq"
      className="section-glow-magenta bg-grid-parallax relative mx-auto max-w-4xl px-5 py-20"
    >
      <ParticleField density={16} className="opacity-40" />
      <Reveal>
        <SectionLabel n={faq.sectionN}>{faq.label}</SectionLabel>
      </Reveal>
      <Reveal delay={80} variant="clip">
        <h2 className="glitch-rgb mt-4 font-display text-3xl md:text-5xl">FAQ</h2>
      </Reveal>
      <p className="mt-4 text-soft">{faq.intro}</p>
      <div className="mt-8 space-y-2">
        {faq.items.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={f.q} className="card-hair card-tilt overflow-hidden">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span className="font-display text-base">{f.q}</span>
                <span
                  className={`font-mono-alt text-magenta transition-transform ${
                    isOpen ? "rotate-45" : ""
                  }`}
                >
                  +
                </span>
              </button>
              <div
                className="grid transition-[grid-template-rows] duration-300"
                style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
              >
                <div className="overflow-hidden">
                  <div className="px-5 pb-4 text-sm leading-relaxed text-soft">{f.a}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}