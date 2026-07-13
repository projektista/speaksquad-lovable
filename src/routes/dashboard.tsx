import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/app-shell";
import { Reveal } from "@/components/fx/reveal";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — SpeakSquad" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  return (
    <AppShell title="Dashboard" subtitle="Sua central de controle." credits={3}>
      <div className="grid gap-4 md:grid-cols-3">
        <Reveal>
          <div className="card-hair p-5">
            <div className="font-mono-alt text-xs text-muted">créditos_disponíveis</div>
            <div className="mt-2 font-display text-4xl text-cyan">3</div>
            <Link to="/credits" className="btn-outline mt-4 w-full !py-2 text-xs">Comprar mais</Link>
          </div>
        </Reveal>
        <Reveal delay={80}>
          <div className="card-hair p-5">
            <div className="font-mono-alt text-xs text-muted">próxima_aula</div>
            <div className="mt-2 font-display text-lg">Ter · 15 jul</div>
            <div className="font-mono-alt text-sm text-cyan">18:00 JST</div>
            <div className="mt-1 font-mono-alt text-xs text-muted">Minecraft · Survival</div>
            <Link to="/schedule" className="btn-outline mt-4 w-full !py-2 text-xs">Ver detalhes</Link>
          </div>
        </Reveal>
        <Reveal delay={160}>
          <div className="card-hair p-5">
            <div className="font-mono-alt text-xs text-muted">total_de_aulas</div>
            <div className="mt-2 font-display text-4xl">12</div>
            <Link to="/lessons" className="btn-outline mt-4 w-full !py-2 text-xs">Histórico</Link>
          </div>
        </Reveal>
      </div>

      <Reveal delay={200}>
        <div className="card-hair mt-8 flex flex-col items-start justify-between gap-4 p-6 md:flex-row md:items-center">
          <div>
            <div className="section-label">// próximo_passo</div>
            <h2 className="mt-2 font-display text-xl">Pronto para agendar sua próxima aula?</h2>
            <p className="mt-1 text-sm text-muted">
              Escolha um horário aberto pelo Hugo esta semana.
            </p>
          </div>
          <Link to="/schedule" className="btn-primary">Agendar aula</Link>
        </div>
      </Reveal>
    </AppShell>
  );
}