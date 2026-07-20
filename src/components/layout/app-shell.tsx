import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
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
  credits = 3,
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
  const creditsLabel = lang === "jp" ? "残りクレジット" : "créditos_disponíveis";
  const buyLabel = lang === "jp" ? "購入" : "Comprar";
  const creditsHref = lang === "jp" ? "/credits" : "/ptbr/credits";
  const navigate = useNavigate();
  const signOutLabel = lang === "jp" ? "ログアウト" : "Sair";

  async function onSignOut() {
    await supabase.auth.signOut();
    navigate({ to: lang === "jp" ? "/" : "/ptbr" });
  }

  return (
    <div className="min-h-screen bg-bg text-foreground">
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
              const activeBorder =
                accent === "magenta"
                  ? "border-[color:var(--magenta)] bg-[color:var(--bg3)] text-magenta"
                  : "border-[color:var(--cyan)] bg-[color:var(--bg3)] text-cyan";
              const cursor = accent === "magenta" ? "text-magenta" : "text-cyan";
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
          {!isTeacher && (
            <div className="mt-8 rounded-[4px] border border-hair bg-bg2 p-3 font-mono-alt text-xs">
              <div className="text-muted">{creditsLabel}</div>
              <div className="mt-1 font-display text-2xl text-cyan">{credits}</div>
              <Link to={creditsHref} className="btn-outline mt-3 w-full !py-2 text-[10px]">
                {buyLabel}
              </Link>
            </div>
          )}
          <button
            type="button"
            onClick={onSignOut}
            className="mt-4 w-full rounded-[4px] border border-hair px-3 py-2 text-left font-mono-alt text-xs text-muted transition-colors hover:border-[color:var(--magenta)] hover:text-magenta"
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