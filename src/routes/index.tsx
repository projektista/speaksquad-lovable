import { createFileRoute, redirect } from "@tanstack/react-router";
import { LandingPage } from "@/components/landing/landing-page";
import { jpContent } from "@/components/landing/landing-content";

export const Route = createFileRoute("/")({
beforeLoad: () => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("speaksquad_lang");

    if (stored === "pt-BR" || stored === "pt") {
      throw redirect({ to: "/ptbr", replace: true });
    }
    if (stored) return; // preferência salva é japonês — respeita, fica em "/"

    const langs = [navigator.language, ...(navigator.languages ?? [])].filter(Boolean);
    const prefersPt = langs.some((l) => l.toLowerCase().startsWith("pt"));
    if (prefersPt) {
      window.localStorage.setItem("speaksquad_lang", "pt-BR");
      throw redirect({ to: "/ptbr", replace: true });
    }
  },
  head: () => ({
    meta: [
      { title: "SpeakSquad — ゲームで英語を身につける" },
      {
        name: "description",
        content:
          "MinecraftとFortniteで学ぶ、日本語がわかる先生とのマンツーマン英会話。初回50分無料。東京。",
      },
      { property: "og:title", content: "SpeakSquad — Level Up Your English" },
      {
        property: "og:description",
        content:
          "ゲームで学ぶマンツーマン英会話。同じ先生が最後まで担当。初回無料。",
      },
    ],
    links: [
      { rel: "alternate", hrefLang: "ja", href: "/" },
      { rel: "alternate", hrefLang: "pt-BR", href: "/ptbr" },
      { rel: "alternate", hrefLang: "x-default", href: "/" },
    ],
  }),
  component: LandingJP,
});

function LandingJP() {
  return <LandingPage content={jpContent} lang="jp" />;
}
