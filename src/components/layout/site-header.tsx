import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LangSwitcher } from "@/components/layout/lang-switcher";

type Lang = "pt" | "jp";

export function SiteHeader({ lang = "pt" }: { lang?: Lang }) {
  const { location } = useRouterState();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const nav =
    lang === "jp"
      ? [
          { href: "#method", label: "メソッド" },
          { href: "#flow", label: "レッスンの流れ" },
          { href: "#pricing", label: "料金" },
          { href: "#faq", label: "FAQ" },
          { href: "/contato", label: "お問い合わせ", isRoute: true },
        ]
      : [
          { href: "#method", label: "Método" },
          { href: "#flow", label: "Fluxo da aula" },
          { href: "#pricing", label: "Preço" },
          { href: "#faq", label: "FAQ" },
          { href: "/ptbr/contato", label: "CONTATO", isRoute: true },
        ];

  return (
    <header
      className={`sticky top-0 z-40 border-b border-hair transition-colors ${
        scrolled ? "bg-[rgba(13,17,23,0.85)] backdrop-blur" : "bg-[rgba(13,17,23,0.6)] backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link
          to={lang === "jp" ? "/" : "/ptbr"}
          className="group brand-link glitch flex items-center gap-2 font-display text-lg"
        >
          <span
            className="inline-flex h-7 w-7 items-center justify-center rounded-[4px] text-[11px] font-bold text-[#04121a]"
            style={{ background: "linear-gradient(135deg,#00d9ff,#ff006e)" }}
          >
            SS
          </span>
          <span className="brand-text whitespace-nowrap decoration-2 underline-offset-4 group-hover:underline group-hover:decoration-[#00d9ff]">
            <span style={{ color: "#f7fafc" }}>Speak</span><span style={{ color: "#ff006e" }}>Squad</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((n) => (
            n.isRoute ? (
              <Link key={n.href} to={n.href} className="btn-ghost link-underline">
                {n.label}
              </Link>
            ) : (
              <a key={n.href} href={n.href} className="btn-ghost link-underline">
                {n.label}
              </a>
            )
          ))}
          <span className="mx-2 h-4 w-px bg-[color:var(--border2)]" />
          <LangSwitcher lang={lang} />
          <Link to={lang === "jp" ? "/login" : "/ptbr/login"} className="btn-ghost link-underline ml-1">
            {lang === "jp" ? "ログイン" : "Entrar"}
          </Link>
          <Link to={lang === "jp" ? "/signup" : "/ptbr/signup"} className="btn-primary btn-shine ml-2 !py-2 !px-3 text-xs">
            {lang === "jp" ? "無料体験" : "Aula grátis"}
          </Link>
        </nav>

        <button
          type="button"
          className="btn-ghost md:hidden"
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "×" : "≡"}
        </button>
      </div>

      {open && (
        <div className="border-t border-hair bg-bg2 md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-4">
            {nav.map((n) => (
              n.isRoute ? (
                <Link key={n.href} to={n.href} className="btn-ghost justify-start">
                  {n.label}
                </Link>
              ) : (
                <a key={n.href} href={n.href} className="btn-ghost justify-start">
                  {n.label}
                </a>
              )
            ))}
            <div className="hair-divider my-2" />
            <div className="px-1">
              <LangSwitcher lang={lang} variant="mobile" />
            </div>
            <Link to={lang === "jp" ? "/login" : "/ptbr/login"} className="btn-outline mt-2 justify-center">
              {lang === "jp" ? "ログイン" : "Entrar"}
            </Link>
            <Link to={lang === "jp" ? "/signup" : "/ptbr/signup"} className="btn-primary mt-1 justify-center">
              {lang === "jp" ? "無料体験" : "Aula grátis"}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}