import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { SectionLabel } from "@/components/fx/section-label";
import { Reveal } from "@/components/fx/reveal";
import { BracketFrame } from "@/components/fx/bracket-frame";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: "Contato — SpeakSquad" },
      {
        name: "description",
        content:
          "Fale com a SpeakSquad. Tire suas dúvidas sobre aulas de inglês via Minecraft e Fortnite antes de começar.",
      },
      { property: "og:title", content: "Contato — SpeakSquad" },
      {
        property: "og:description",
        content: "Fale com a SpeakSquad. Estamos aqui para ajudar antes da sua primeira aula.",
      },
    ],
  }),
  component: Contato,
});

function Contato() {
  const [sent, setSent] = useState(false);
  return (
    <div className="min-h-screen bg-bg text-foreground">
      <SiteHeader lang="pt" />
      <section className="mx-auto max-w-5xl px-5 py-16 md:py-24">
        <Reveal>
          <SectionLabel n="00">Contato</SectionLabel>
        </Reveal>
        <Reveal delay={80}>
          <h1 className="mt-4 font-display text-4xl leading-[1.05] md:text-6xl">
            <span style={{ color: "#f7fafc" }}>Vamos</span>{" "}
            <span style={{ color: "#00d9ff" }}>conversar</span>{" "}
            <span style={{ color: "#ff006e" }}>já</span>.
          </h1>
        </Reveal>
        <Reveal delay={140}>
          <p className="mt-6 max-w-xl text-soft">
            Dúvidas sobre método, agendamento ou pacotes? Escreva abaixo e respondemos em até 24h.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-8 md:grid-cols-[1fr_320px]">
          <Reveal delay={160}>
            <BracketFrame className="p-6">
              {sent ? (
                <div className="py-8 text-center font-mono-alt text-sm text-success">
                  ✓ Mensagem enviada. Obrigado — retornaremos em breve.
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
                      Nome
                    </span>
                    <input
                      required
                      className="mt-2 w-full rounded-[4px] border border-hair bg-bg2 px-3 py-2 font-mono-alt text-sm text-foreground outline-none focus:border-cyan"
                      placeholder="Seu nome"
                    />
                  </label>
                  <label className="block">
                    <span className="font-mono-alt text-xs uppercase tracking-widest text-muted">
                      Email
                    </span>
                    <input
                      type="email"
                      required
                      className="mt-2 w-full rounded-[4px] border border-hair bg-bg2 px-3 py-2 font-mono-alt text-sm text-foreground outline-none focus:border-cyan"
                      placeholder="seu@email.com"
                    />
                  </label>
                  <label className="block">
                    <span className="font-mono-alt text-xs uppercase tracking-widest text-muted">
                      Assunto
                    </span>
                    <input
                      className="mt-2 w-full rounded-[4px] border border-hair bg-bg2 px-3 py-2 font-mono-alt text-sm text-foreground outline-none focus:border-cyan"
                      placeholder="Ex.: dúvida sobre pacotes"
                    />
                  </label>
                  <label className="block">
                    <span className="font-mono-alt text-xs uppercase tracking-widest text-muted">
                      Mensagem
                    </span>
                    <textarea
                      required
                      rows={6}
                      className="mt-2 w-full resize-y rounded-[4px] border border-hair bg-bg2 px-3 py-2 font-mono-alt text-sm text-foreground outline-none focus:border-cyan"
                      placeholder="Escreva sua mensagem..."
                    />
                  </label>
                  <button type="submit" className="btn-primary w-full justify-center">
                    Enviar mensagem
                  </button>
                </form>
              )}
            </BracketFrame>
          </Reveal>

          <Reveal delay={220}>
            <div className="space-y-6 font-mono-alt text-sm">
              <div className="card-hair p-5">
                <div className="text-xs uppercase tracking-widest text-violet">Email</div>
                <div className="mt-2 break-all text-soft">contato@speaksquad.jp</div>
              </div>
              <div className="card-hair p-5">
                <div className="text-xs uppercase tracking-widest text-violet">Horário</div>
                <div className="mt-2 text-soft">Seg–Sex · 10h–20h (JST)</div>
              </div>
              <div className="card-hair p-5">
                <div className="text-xs uppercase tracking-widest text-violet">Base</div>
                <div className="mt-2 text-soft">Tóquio · Japão</div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
      <SiteFooter lang="pt" />
    </div>
  );
}