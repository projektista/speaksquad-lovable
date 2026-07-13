import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";

const items = [
  { to: "/admin", label: "Overview", code: "00" },
  { to: "/admin/schedule", label: "Agenda", code: "01" },
  { to: "/admin/availability", label: "Disponibilidade", code: "02" },
  { to: "/admin/students", label: "Alunos", code: "03" },
  { to: "/admin/finance", label: "Finanças", code: "04" },
] as const;

export function AdminShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  const { location } = useRouterState();
  return (
    <div className="min-h-screen bg-bg text-foreground">
      <div className="border-b border-hair bg-bg2">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 font-mono-alt text-xs">
          <div className="flex items-center gap-3">
            <span className="rounded-[3px] border border-[color:var(--magenta)] px-1.5 py-0.5 text-magenta">
              [ ADMIN ]
            </span>
            <span className="text-muted">console · hugo@speaksquad.jp</span>
          </div>
          <Link to="/dashboard" className="btn-ghost !p-0 text-xs">
            ← sair do admin
          </Link>
        </div>
      </div>
      <div className="mx-auto flex max-w-6xl gap-6 px-4 py-6 md:py-10">
        <aside className="hidden w-56 shrink-0 md:block">
          <nav className="flex flex-col gap-1 font-mono-alt text-sm">
            {items.map((it) => {
              const active =
                it.to === "/admin"
                  ? location.pathname === "/admin"
                  : location.pathname.startsWith(it.to);
              return (
                <Link
                  key={it.to}
                  to={it.to}
                  className={`flex items-center justify-between rounded-[4px] border px-3 py-2 transition-colors ${
                    active
                      ? "border-[color:var(--magenta)] bg-[color:var(--bg3)] text-magenta"
                      : "border-transparent text-muted hover:border-hair hover:text-foreground"
                  }`}
                >
                  <span>
                    <span className="mr-2 text-muted">{it.code}</span>
                    {it.label}
                  </span>
                  {active && <span>▊</span>}
                </Link>
              );
            })}
          </nav>
        </aside>
        <main className="min-w-0 flex-1">
          <div className="mb-6 border-b border-hair pb-4">
            <div className="section-label mb-2 text-magenta">
              // admin_{title.toLowerCase().replace(/\s+/g, "_")}
            </div>
            <h1 className="font-display text-2xl md:text-3xl">{title}</h1>
            {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}