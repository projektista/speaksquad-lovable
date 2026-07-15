import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "@/components/landing/landing-page";
import { jpContent } from "@/components/landing/landing-content";

export const Route = createFileRoute("/jp")({
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
      { rel: "alternate", hrefLang: "pt-BR", href: "/" },
      { rel: "alternate", hrefLang: "ja", href: "/jp" },
      { rel: "alternate", hrefLang: "x-default", href: "/" },
    ],
  }),
  component: LandingJP,
});

function LandingJP() {
  return <LandingPage content={jpContent} lang="jp" />;
}
