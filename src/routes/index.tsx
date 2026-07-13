import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { SectionLabel } from "@/components/fx/section-label";
import { TypingText } from "@/components/fx/typing-text";
import { Reveal } from "@/components/fx/reveal";
import { ParticleField } from "@/components/fx/particle-field";
import { BracketFrame } from "@/components/fx/bracket-frame";
import { GlitchText } from "@/components/fx/glitch-text";
import { useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SpeakSquad — Aprenda inglês jogando Minecraft e Fortnite" },
      {
        name: "description",
        content:
          "Aulas 1-on-1 de inglês através de Minecraft e Fortnite. Mesmo professor sempre, 50 min via Zoom. Primeira aula grátis. Tokyo.",
      },
      { property: "og:title", content: "SpeakSquad — Level Up Your English" },
      {
        property: "og:description",
        content:
          "Aulas 1-on-1 de inglês através de games. Mesmo professor sempre. Primeira aula grátis.",
      },
    ],
    links: [
      { rel: "alternate", hrefLang: "pt-BR", href: "/" },
      { rel: "alternate", hrefLang: "ja", href: "/jp" },
      { rel: "alternate", hrefLang: "x-default", href: "/" },
    ],
  }),
  component: LandingPT,
});

const features = [
  { t: "Professor dedicado", d: "Um professor que conhece seu progresso, seu nível e seus jogos favoritos. Ele atua como tutor, dando instruções específicas para você." },
  { t: "Conversação real", d: "Não é sala de aula, ficando na revisão de gramática e regras. Usamos inglês em contexto: dar ordens no jogo, descrever estratégias, reagir a situações." },
  { t: "Progresso acompanhado", d: "Cada aula gera uma entrada no seu histórico. O professor envia relatório com vocabulário trabalhado e pontos a treinar." },
  { t: "Ambiente seguro", d: "Você fica à vontade para se expressar e treinar seu inglês, sem julgamento, num ambiente descontraído." },
  { t: "Diversão", d: "O principal objetivo é ser uma forma divertida de aprender inglês. Seu tutor também gosta de jogos." },
  { t: "Simplicidade", d: "Cadastro, compra de créditos (1 crédito = 1 aula) e agendamento. Sem burocracia no meio do caminho." },
];

const fluxo = [
  { n: "01", t: "Introdução", d: "Conversa introdutória e tranquila. Muitas vezes usada para revisar o que já foi visto e alinhar o foco daquela aula." },
  { n: "02", t: "Gameplay", d: "Durante o jogo, o professor ensina e ajuda o aluno a se expressar com frases e termos de forma natural, no contexto do que está acontecendo." },
  { n: "03", t: "Revisão", d: "Repetimos palavras e frases usadas durante o jogo, focando no que foi mais difícil, e o ajudamos a sair confiante." },
];

const passos = [
  { n: "PASSO 1", t: "Registre-se", d: "Insira nome, email e senha para criar sua conta." },
  { n: "PASSO 2", t: "Complete seu perfil", d: "Escolha seu jogo de preferência e conte um pouco sobre você." },
  { n: "PASSO 3", t: "Agende sua aula", d: "Escolha o horário que funciona melhor para você." },
  { n: "PASSO 4", t: "Entre na aula", d: "Acesse a videoconferência pelo seu perfil ou pelo link no email." },
];

const pricing = [
  { name: "Unitário", price: "¥2.000", per: "por aula", features: ["1 aula de 50 minutos", "Sem expiração", "Flexibilidade total"], footer: "Sem contrato. Sem matrícula.", featured: false, save: null },
  { name: "Pacote 5", price: "¥8.500", per: "¥1.700 por aula", save: "economize 15%", features: ["5 aulas de 50 minutos", "Sem expiração", "Flexibilidade total", "Prioridade no agendamento"], footer: "Teste uma aula grátis antes.", featured: true },
  { name: "Pacote 10", price: "¥14.000", per: "¥1.400 por aula", save: "economize 30%", features: ["10 aulas de 50 minutos", "Sem expiração", "Flexibilidade total", "Prioridade no agendamento"], footer: "Sem contrato. Sem surpresas.", featured: false },
];

const requisitos = [
  { t: "Jogo instalado e atualizado", o: "No seu console ou PC" },
  { t: "Zoom", o: "Para a videochamada com o professor" },
  { t: "PC, tablet ou smartphone", o: "Qualquer um serve" },
  { t: "Fone com microfone", o: "Opcional, mas recomendado" },
];

const faq = [
  { q: "Meu filho precisa já saber inglês para começar?", a: "Não. Atendemos desde quem nunca estudou até níveis avançados. Na aula experimental avaliamos o nível atual e ajustamos o ritmo a partir daí." },
  { q: "Os créditos expiram?", a: "Não. Uma vez comprado, o crédito é seu, sem prazo de validade." },
  { q: "Posso cancelar ou remarcar uma aula agendada?", a: "Sim, com antecedência mínima informada no agendamento. Avisos de última hora podem consumir o crédito da aula." },
  { q: "Dois irmãos podem fazer aula juntos?", a: "Preferimos aulas individuais. É comum as crianças caírem no português entre si durante a aula, o que reduz o tempo real de prática em inglês." },
  { q: "Preciso ter o jogo comprado antes da aula experimental?", a: "Sim, o aluno precisa ter Minecraft ou Fortnite instalado e funcionando no dispositivo que for usar." },
  { q: "Como funciona o pagamento?", a: "Pelo Stripe, com criptografia completa. Seus dados de cartão não ficam armazenados na SpeakSquad." },
];

function LandingPT() {
  return (
    <div className="min-h-screen bg-bg text-foreground">
      <SiteHeader lang="pt" />
      <Hero />
      <Metodo />
      <Features />
      <Fluxo />
      <Gratis />
      <Pricing />
      <Requisitos />
      <Sobre />
      <CTA />
      <FAQ />
      <SiteFooter lang="pt" />
    </div>
  );
}

function Hero() {
  return (
    <section id="hero" className="relative overflow-hidden">
      <ParticleField density={36} />
      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-5 pb-16 pt-14 md:grid-cols-[1.2fr_0.8fr] md:pb-24 md:pt-20">
        <div>
          <SectionLabel n="00">
            <span className="text-cyan">&gt;_</span> LEVEL UP YOUR ENGLISH
          </SectionLabel>
          <h1 className="mt-5 font-display text-4xl leading-[1.05] md:text-6xl">
            <span className="block">APRENDA INGLÊS</span>
            <span className="block">
              <span className="text-muted lowercase">jogando</span>{" "}
              <span className="text-cyan">
                <TypingText text="GAMES" speed={90} startDelay={350} />
              </span>
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-soft">
            Um método de ensino que usa conversação em jogos 1:1. Aprenda inglês fazendo o que
            você já gosta de fazer. Ideal para quem tem vontade de aprender e poucas
            oportunidades de praticar.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link to="/signup" className="btn-primary">Primeira aula grátis</Link>
            <a href="#method" className="btn-outline">Ver o método</a>
          </div>
          <p className="mt-4 flex items-center gap-2 font-mono-alt text-xs text-muted">
            <span className="text-success">✓</span> Sem cartão para a aula experimental.
          </p>
          <div className="mt-8 flex flex-wrap gap-2 font-mono-alt text-xs">
            <span className="rounded-[4px] border-hair bg-bg2 px-2.5 py-1 text-soft">Minecraft</span>
            <span className="rounded-[4px] border-hair bg-bg2 px-2.5 py-1 text-soft">Fortnite</span>
            <span className="rounded-[4px] border-hair bg-bg2 px-2.5 py-1 text-soft">{"\n"}</span>
          </div>
        </div>

        <BracketFrame className="relative p-5">
          <div className="section-label mb-4">// VANTAGENS</div>
          <div className="space-y-4 font-mono-alt">
            {[
              { v: "1-on-1", l: "mesmo professor sempre" },
              { v: "50min", l: "por aula, sem enrolação" },
              { v: "¥0", l: "para experimentar" },
            ].map((s, i) => (
              <Reveal key={s.v} delay={i * 80} className="flex items-baseline justify-between border-b border-hair pb-3">
                <span className="font-display text-2xl text-cyan md:text-3xl">{s.v}</span>
                <span className="text-xs text-muted">{s.l}</span>
              </Reveal>
            ))}
          </div>
          <div className="mt-6 flex items-center justify-between font-mono-alt text-[10px] uppercase tracking-widest text-muted">
            <span>{"\n"}</span>
            <span className="text-success">▊ online</span>
          </div>
        </BracketFrame>
      </div>
      <div className="hair-divider mx-auto max-w-6xl" />
    </section>
  );
}

function Metodo() {
  return (
    <section id="method" className="relative mx-auto max-w-6xl px-5 py-20">
      <Reveal>
        <SectionLabel n="01">O método</SectionLabel>
      </Reveal>
      <Reveal delay={80}>
        <h2 className="mt-4 max-w-3xl font-display text-3xl md:text-5xl">
          Esse método <span className="text-cyan">vai funcionar</span> com você.
        </h2>
      </Reveal>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Reveal delay={120}>
          <p className="text-soft">
            Quando forçamos algo que não gostamos, fica estressante e fácil de desistir. Quando
            fazemos algo que já temos interesse, é mais fácil manter o hábito.
          </p>
        </Reveal>
        <Reveal delay={200}>
          <p className="text-soft">
            Esse método de conversação em inglês através de jogos pega algo que você já gosta,
            jogar, para desenvolver e melhorar sua habilidade no idioma.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="features" className="border-t border-hair bg-bg2/40">
      <div className="mx-auto max-w-6xl px-5 py-20">
        <Reveal><SectionLabel n="02">Diferenciais</SectionLabel></Reveal>
        <Reveal delay={80}>
          <h2 className="mt-4 max-w-3xl font-display text-3xl md:text-5xl">
            Aprenda <span className="text-magenta">falando</span>, não decorando.
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {features.map((f, i) => (
            <Reveal key={f.t} delay={i * 60}>
              <div className="card-hair h-full p-6">
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

function Fluxo() {
  return (
    <section id="flow" className="mx-auto max-w-6xl px-5 py-20">
      <Reveal><SectionLabel n="03">Estrutura da aula</SectionLabel></Reveal>
      <Reveal delay={80}>
        <h2 className="mt-4 max-w-3xl font-display text-3xl md:text-5xl">
          Como é o <span className="text-cyan">fluxo</span> da aula.
        </h2>
      </Reveal>
      <p className="mt-4 max-w-2xl text-soft">
        Cada aula é dividida em três partes. Não é só "entrar e jogar".
      </p>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {fluxo.map((f, i) => (
          <Reveal key={f.n} delay={i * 100}>
            <div className="card-hair relative h-full overflow-hidden p-6">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-2 -top-6 font-display text-[6rem] leading-none text-[color:var(--bg3)]"
              >
                {f.n}
              </div>
              <div className="relative">
                <div className="font-mono-alt text-xs text-violet">PARTE {f.n}</div>
                <h3 className="mt-2 font-display text-xl">{f.t}</h3>
                <p className="mt-3 text-sm leading-relaxed text-soft">{f.d}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Gratis() {
  return (
    <section id="how" className="border-t border-hair bg-bg2/40">
      <div className="mx-auto max-w-6xl px-5 py-20">
        <Reveal><SectionLabel n="04">Como funciona</SectionLabel></Reveal>
        <Reveal delay={80}>
          <h2 className="mt-4 max-w-3xl font-display text-3xl md:text-5xl">
            Sua <span className="text-cyan">1ª aula é gratuita</span>.
          </h2>
        </Reveal>
        <Reveal delay={140}>
          <div className="mt-6 flex items-center gap-3 rounded-[4px] border border-[color:var(--success)]/40 bg-[color:color-mix(in_oklab,var(--success)_10%,transparent)] px-4 py-3 font-mono-alt text-sm text-soft">
            <span className="text-success">✓</span>
            {"\n"}Criar sua conta e agendar sua primeira aula, leva poucos minutos. Vale a pena!
          </div>
        </Reveal>
        <div className="mt-10 grid gap-4 md:grid-cols-4">
          {passos.map((p, i) => (
            <Reveal key={p.n} delay={i * 80}>
              <div className="card-hair h-full p-5">
                <div className="font-mono-alt text-[11px] tracking-widest text-violet">{p.n}</div>
                <h3 className="mt-2 font-display text-lg">{p.t}</h3>
                <p className="mt-2 text-sm text-soft">{p.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="pricing" className="mx-auto max-w-6xl px-5 py-20">
      <Reveal><SectionLabel n="05">Preço</SectionLabel></Reveal>
      <Reveal delay={80}>
        <h2 className="mt-4 max-w-3xl font-display text-3xl md:text-5xl">
          Simples,&nbsp;transparente e direto.
        </h2>
      </Reveal>
      <p className="mt-4 max-w-2xl text-soft">
        1 crédito = 1 aula de 50 minutos. Compre o que precisar, quando precisar.
      </p>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {pricing.map((p, i) => (
          <Reveal key={p.name} delay={i * 100}>
            <div
              className={`card-hair relative flex h-full flex-col p-6 ${
                p.featured ? "border-[color:var(--cyan)]" : ""
              }`}
            >
              {p.featured && (
                <div className="absolute -top-3 left-4 rounded-[3px] border border-[color:var(--magenta)] bg-bg px-2 py-0.5 font-mono-alt text-[10px] uppercase tracking-widest text-magenta">
                  [ mais_popular ]
                </div>
              )}
              <div className="font-mono-alt text-xs uppercase tracking-widest text-muted">
                {p.name}
              </div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="font-mono-alt text-4xl font-semibold text-foreground">
                  <span className="text-magenta">¥</span>
                  {p.price.replace("¥", "")}
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
                to="/signup"
                className={`mt-6 w-full ${p.featured ? "btn-primary" : "btn-outline"}`}
              >
                Comprar
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

function Requisitos() {
  return (
    <section id="requirements" className="border-t border-hair bg-bg2/40">
      <div className="mx-auto max-w-6xl px-5 py-20">
        <Reveal><SectionLabel n="06">Antes de começar</SectionLabel></Reveal>
        <Reveal delay={80}>
          <h2 className="mt-4 max-w-3xl font-display text-3xl md:text-5xl">
            O que você <span className="text-cyan">precisa ter</span>.
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-3 md:grid-cols-2">
          {requisitos.map((r, i) => (
            <Reveal key={r.t} delay={i * 60}>
              <div className="card-hair flex items-start gap-4 p-5">
                <span className="mt-0.5 font-mono-alt text-xs text-cyan">[{String(i + 1).padStart(2, "0")}]</span>
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

function Sobre() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-5 py-20">
      <Reveal><SectionLabel n="07">Sobre</SectionLabel></Reveal>
      <div className="mt-6 grid gap-8 md:grid-cols-[280px_1fr] md:gap-12">
        <Reveal>
          <BracketFrame className="p-6 text-center">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border-hair2 bg-bg3 text-4xl">
              🎮
            </div>
            <div className="mt-4 font-display text-xl">Hugo</div>
            <div className="mt-1 font-mono-alt text-xs text-muted">
              Fundador · Instrutor ·&nbsp;Gamer
            </div>
            <div className="mt-4 font-mono-alt text-[10px] uppercase tracking-widest text-cyan">
              {"\n"}
            </div>
          </BracketFrame>
        </Reveal>
        <Reveal delay={100}>
          <div className="space-y-4 text-soft">
            <p>
              A SpeakSquad começou porque eu, Hugo, percebi que oportunidades estavam sendo
              perdidas. Alunos que gostam de jogar e querem aprender inglês acabam a aula apenas
              com a sensação de que foi legal jogar com o professor.
            </p>
            <p>
              Deixar as aulas muito livres pode prejudicar o aprendizado. A troca constante de
              professores não é a melhor estratégia para quem está começando. E permitir dois ou
              mais irmãos na mesma aula faz as crianças caírem no português.
            </p>
            <p>
              Peguei um método que já existe no mercado, aulas de inglês via jogos, e adicionei o
              que faltava: continuidade pedagógica, modo de jogo escolhido com a intenção de
              ensinar inglês, e adaptação real para cada aluno.
            </p>
            <p>
              Ainda sou eu quem dá as aulas. Não é um app, nem IA. É uma pessoa que se importa
              com o desenvolvimento do seu filho e tem critérios claros sobre como uma boa aula
              funciona.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section id="cta" className="relative overflow-hidden border-y border-hair bg-bg2/40">
      <ParticleField density={30} />
      <div className="relative mx-auto max-w-4xl px-5 py-24 text-center">
        <Reveal>
          <SectionLabel n="08">Interessou?</SectionLabel>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="mt-6 font-display text-3xl md:text-5xl">
            Comece sua primeira<br />
            <span className="text-cyan">aula gratuita</span> já.
          </h2>
        </Reveal>
        <Reveal delay={140}>
          <p className="mx-auto mt-4 max-w-xl text-soft">
            Sem registro complicado. Sem cobrança escondida. 50 minutos de aula real, e depois
            você decide.
          </p>
        </Reveal>
        <Reveal delay={200}>
          <div className="mt-8">
            <Link to="/signup" className="btn-primary">Agendar aula experimental</Link>
          </div>
        </Reveal>
        <p className="mt-6 font-mono-alt text-xs text-muted">
          Faça um teste já!
        </p>
      </div>
    </section>
  );
}

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="mx-auto max-w-4xl px-5 py-20">
      <Reveal><SectionLabel n="09">Perguntas frequentes</SectionLabel></Reveal>
      <Reveal delay={80}>
        <h2 className="mt-4 font-display text-3xl md:text-5xl">FAQ</h2>
      </Reveal>
      <p className="mt-4 text-soft">
        Se sua dúvida não estiver aqui, é só perguntar antes da aula experimental.
      </p>
      <div className="mt-8 space-y-2">
        {faq.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={f.q} className="card-hair overflow-hidden">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span className="font-display text-base">{f.q}</span>
                <span
                  className={`font-mono-alt text-cyan transition-transform ${isOpen ? "rotate-45" : ""}`}
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
