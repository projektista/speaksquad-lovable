import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";

const items = [
  { to: "/dashboard", label: "Dashboard", code: "01" },
  { to: "/schedule", label: "Agendar", code: "02" },
  { to: "/lessons", label: "Aulas", code: "03" },
  { to: "/credits", label: "Créditos", code: "04" },
  { to: "/profile", label: "Perfil", code: "05" },
] as const;

export function AppShell({
  title,
  subtitle,
  credits = 3,
  children,
}: {
  title: string;
  subtitle?: string;
  credits?: number;
  children: ReactNode;
}) {
  const { location } = useRouterState();
  return (
    <div className="min-h-screen bg-bg text-foreground">
      <div className="mx-auto flex max-w-6xl gap-6 px-4 py-6 md:py-10">
        <aside className="hidden w-56 shrink-0 md:block">
          <Link to="/" className="mb-6 block font-display text-sm">
            <span className="text-muted">// </span>speak<span className="text-cyan">squad</span>
          </Link>
          <nav className="flex flex-col gap-1 font-mono-alt text-sm">
            {items.map((it) => {
              const active = location.pathname.startsWith(it.to);
              return (
                <Link
                  key={it.to}
                  to={it.to}
                  className={`flex items-center justify-between rounded-[4px] border px-3 py-2 transition-colors ${
                    active
                      ? "border-[color:var(--cyan)] bg-[color:var(--bg3)] text-cyan"
                      : "border-transparent text-muted hover:border-hair hover:text-foreground"
                  }`}
                >
                  <span>
                    <span className="mr-2 text-muted">{it.code}</span>
                    {it.label}
                  </span>
                  {active && <span className="text-cyan">▊</span>}
                </Link>
              );
            })}
          </nav>
          <div className="mt-8 rounded-[4px] border-hair bg-bg2 p-3 font-mono-alt text-xs">
            <div className="text-muted">créditos_disponíveis</div>
            <div className="mt-1 font-display text-2xl text-cyan">{credits}</div>
            <Link to="/credits" className="btn-outline mt-3 w-full !py-2 text-[10px]">
              Comprar
            </Link>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <div className="mb-6 border-b border-hair pb-4">
            <div className="section-label mb-2">// {title.toLowerCase().replace(/\s+/g, "_")}</div>
            <h1 className="font-display text-2xl md:text-3xl">{title}</h1>
            {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}