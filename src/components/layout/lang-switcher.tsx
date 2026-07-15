import { useRouter, useRouterState } from "@tanstack/react-router";
import { Globe } from "lucide-react";
import { pathForLang, persistLang, type Lang } from "@/lib/i18n";

/**
 * Subtle language toggle: small globe icon + PT/JP inline. The active
 * language is highlighted; clicking the inactive one navigates to the
 * equivalent route in that language and persists the preference.
 */
export function LangSwitcher({ lang, variant = "header" }: { lang: Lang; variant?: "header" | "mobile" }) {
  const router = useRouter();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const go = (target: Lang) => {
    persistLang(target);
    if (target === lang) return;
    router.navigate({ to: pathForLang(pathname, target) });
  };

  const btn = (target: Lang, label: string) => {
    const active = target === lang;
    return (
      <button
        type="button"
        onClick={() => go(target)}
        aria-label={target === "jp" ? "日本語" : "Português"}
        aria-current={active ? "true" : undefined}
        className={`px-1 transition-colors ${
          active ? "text-cyan" : "text-muted hover:text-magenta"
        }`}
      >
        {label}
      </button>
    );
  };

  return (
    <div
      className={
        variant === "header"
          ? "flex items-center gap-1 rounded-[4px] border border-hair bg-bg2/60 px-2 py-1 font-mono-alt text-[11px]"
          : "flex items-center gap-1 font-mono-alt text-xs"
      }
    >
      <Globe className="h-3.5 w-3.5 text-muted" aria-hidden />
      {btn("pt", "PT")}
      <span className="text-muted/60">/</span>
      {btn("jp", "JP")}
    </div>
  );
}