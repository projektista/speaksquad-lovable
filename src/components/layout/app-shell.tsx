import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { BrandMark } from "@/components/fx/brand-mark";
import { supabase } from "@/integrations/supabase/client";
import { useRoles } from "@/hooks/use-role";

type Lang = "pt" | "jp";

const studentItemsByLang: Record<Lang, Array<{ to: string; label: string }>> = {
  pt: [
    { to: "/ptbr/dashboard", label: "Dashboard" },
    { to: "/ptbr/schedule", label: "Agendar" },
    { to: "/ptbr/lessons", label: "Aulas" },
    { to: "/ptbr/credits", label: "Créditos" },
    { to: "/ptbr/profile", label: "Perfil" },
  ],
  jp: [
    { to: "/dashboard", label: "ダッシュボード" },
    { to: "/schedule", label: "予約" },
    { to: "/lessons", label: "レッスン" },
    { to: "/credits", label: "クレジット" },
    { to: "/profile", label: "プロフィール" },
  ],
};

const teacherItems: Array<{ to: string; label: string }> = [
  { to: "/teacher/dashboard", label: "Dashboard" },
  { to: "/teacher/agendamento", label: "Agenda" },
  { to: "/teacher/aulas", label: "Aulas" },
  { to: "/teacher/perfil", label: "Perfil" },
];

export function AppShell({
  title,
  subtitle,
  credits,
  children,
  lang = "pt",
}: {
  title: string;
  subtitle?: string;
  credits?: number;
  children: ReactNode;
  lang?: Lang;
}) {
  const { location } = useRouterState();
  const { isTeacher } = useRoles();
  const items = isTeacher ? teacherItems : studentItemsByLang[lang];
  const accent = isTeacher ? "magenta" : "cyan";
  const navigate = useNavigate();
  const signOutLabel = lang === "jp" ? "ログアウト" : "Sair";
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  async function onSignOut() {
    await supabase.auth.signOut();
    navigate({ to: lang === "jp" ? "/" : "/ptbr" });
  }

  // Kept for backward compatibility — most pages no longer pass credits and
  // the sidebar widget was removed, so this value is currently unused. The
  // shared query key keeps the cache warm for pages that DO show credits
  // (Dashboard, Credits) without a second network round-trip.
  void credits;

  const activeBorder =
    accent === "magenta"
      ? "border-[color:var(--magenta)] bg-[color:var(--bg3)] text-magenta"
      : "border-[color:var(--cyan)] bg-[color:var(--bg3)] text-cyan";
  const cursor = accent === "magenta" ? "text-magenta" : "text-cyan";

  return (
    <div className="app-surface min-h-screen text-foreground">
      <div className="sticky top-0 z-40 border-b border-hair bg-[rgba(13,17,23,0.85)] backdrop-blur md:hidden">
        <div className="flex h-14 items-center justify-between px-4">
          <BrandMark to={lang === "jp" ? "/" : "/ptbr"} size="sm" />
          <button
            type="button"
            aria-label="Menu"
            className="btn-ghost"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? "×" : "≡"}
          </button>
        </div>
        {mobileOpen && (
          <div className="border-t border-hair bg-bg2">
            {isTeacher && (
              <div className="px-4 pt-3 font-mono-alt text-[10px] uppercase tracking-widest text-magenta">
                // teacher_console
              </div>
            )}
            <nav className="flex flex-col gap-1 px-4 py-3 font-mono-alt text-sm">
              {items.map((it) => {
                const active =
                  location.pathname === it.to ||
                  location.pathname.startsWith(it.to + "/");
                return (
                  <Link
                    key={it.to}
                    to={it.to}
                    className={`flex items-center justify-between rounded-[4px] border px-3 py-2 transition-colors ${
                      active
                        ? activeBorder
                        : "border-transparent text-muted hover:border-hair hover:text-foreground"
                    }`}
                  >
                    <span>{it.label}</span>
                    {active && <span className={cursor}>▊</span>}
                  </Link>
                );
              })}
              <button
                type="button"
                onClick={onSignOut}
                className="mt-3 w-full rounded-[4px] border border-hair px-3 py-2 text-left font-mono-alt text-xs text-muted transition-colors hover:border-[color:var(--magenta)] hover:text-magenta"
              >
                ← {signOutLabel}
              </button>
            </nav>
          </div>
        )}
      </div>

      <div className="mx-auto flex max-w-6xl gap-6 px-4 py-6 md:py-10">
        <aside className="hidden w-56 shrink-0 md:block">
          <div className="mb-6">
            <BrandMark to={lang === "jp" ? "/" : "/ptbr"} size="sm" />
          </div>
          {isTeacher && (
            <div className="mb-2 px-2 font-mono-alt text-[10px] uppercase tracking-widest text-magenta">
              // teacher_console
            </div>
          )}
          <nav className="flex flex-col gap-1 font-mono-alt text-sm">
            {items.map((it) => {
              const active =
                location.pathname === it.to || location.pathname.startsWith(it.to + "/");
              return (
                <Link
                  key={it.to}
                  to={it.to}
                  className={`flex items-center justify-between rounded-[4px] border px-3 py-2 transition-colors ${
                    active
                      ? activeBorder
                      : "border-transparent text-muted hover:border-hair hover:text-foreground"
                  }`}
                >
                  <span>{it.label}</span>
                  {active && <span className={cursor}>▊</span>}
                </Link>
              );
            })}
          </nav>
          <button
            type="button"
            onClick={onSignOut}
            className="mt-8 w-full rounded-[4px] border border-hair px-3 py-2 text-left font-mono-alt text-xs text-muted transition-colors hover:border-[color:var(--magenta)] hover:text-magenta"
          >
            ← {signOutLabel}
          </button>
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