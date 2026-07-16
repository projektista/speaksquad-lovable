import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { BrandMark } from "@/components/fx/brand-mark";
import { supabase } from "@/integrations/supabase/client";
import { useRoles } from "@/hooks/use-role";

type Lang = "pt" | "jp";

const itemsByLang: Record<Lang, Array<{ to: string; label: string; code: string }>> = {
  pt: [
    { to: "/dashboard", label: "Dashboard", code: "01" },
    { to: "/schedule", label: "Agendar", code: "02" },
    { to: "/lessons", label: "Aulas", code: "03" },
    { to: "/credits", label: "Créditos", code: "04" },
    { to: "/profile", label: "Perfil", code: "05" },
  ],
  jp: [
    { to: "/jp/dashboard", label: "ダッシュボード", code: "01" },
    { to: "/jp/schedule", label: "予約", code: "02" },
    { to: "/jp/lessons", label: "レッスン", code: "03" },
    { to: "/jp/credits", label: "クレジット", code: "04" },
    { to: "/jp/profile", label: "プロフィール", code: "05" },
  ],
};

const teacherItems: Array<{ to: string; label: string; code: string }> = [
  { to: "/teacher/dashboard", label: "Dashboard Pro", code: "T1" },
  { to: "/teacher/agendamento", label: "Agendamento", code: "T2" },
  { to: "/teacher/aulas", label: "Todas as aulas", code: "T3" },
  { to: "/teacher/perfil", label: "Perfil professor", code: "T4" },
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
  const items = itemsByLang[lang];
  const { isTeacher } = useRoles();
  const creditsLabel = lang === "jp" ? "残りクレジット" : "créditos_disponíveis";
  const buyLabel = lang === "jp" ? "購入" : "Comprar";
  const creditsHref = lang === "jp" ? "/jp/credits" : "/credits";
  const navigate = useNavigate();
  const signOutLabel = lang === "jp" ? "ログアウト" : "Sair";

  async function onSignOut() {
    await supabase.auth.signOut();
    navigate({ to: lang === "jp" ? "/jp" : "/" });
  }

  return (
    <div className="min-h-screen bg-bg text-foreground">
      <div className="mx-auto flex max-w-6xl gap-6 px-4 py-6 md:py-10">
        <aside className="hidden w-56 shrink-0 md:block">
          <div className="mb-6">
            <BrandMark to={lang === "jp" ? "/jp" : "/"} size="sm" />
          </div>
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
          {isTeacher && (
            <>
              <div className="mt-6 mb-2 px-2 font-mono-alt text-[10px] uppercase tracking-widest text-magenta">
                // teacher_menu
              </div>
              <nav className="flex flex-col gap-1 font-mono-alt text-sm">
                {teacherItems.map((it) => {
                  const active = location.pathname.startsWith(it.to);
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
                      {active && <span className="text-magenta">▊</span>}
                    </Link>
                  );
                })}
              </nav>
            </>
          )}
          <div className="mt-8 rounded-[4px] border-hair bg-bg2 p-3 font-mono-alt text-xs">
            <div className="text-muted">{creditsLabel}</div>
            <div className="mt-1 font-display text-2xl text-cyan">{credits}</div>
            <Link to={creditsHref} className="btn-outline mt-3 w-full !py-2 text-[10px]">
              {buyLabel}
            </Link>
          </div>
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