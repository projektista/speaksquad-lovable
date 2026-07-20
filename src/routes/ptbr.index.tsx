import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "@/components/landing/landing-page";
import { ptContent } from "@/components/landing/landing-content";

export const Route = createFileRoute("/ptbr/")({
  head: () => ({
    meta: [
      { title: "SpeakSquad — Aprenda inglês jogando Minecraft e Fortnite" },
      {
        name: "description",
        content:
          "Aulas 1-on-1 de inglês através de Minecraft e Fortnite. Mesmo professor sempre, 50 min via Zoom. Primeira aula grátis. Tokyo.",
      },
      { property: "og:title", content: "SpeakSquad — Level Up Your English" },
      {
        property: "og:description",
        content:
          "Aulas 1-on-1 de inglês através de games. Mesmo professor sempre. Primeira aula grátis.",
      },
    ],
    links: [
      { rel: "alternate", hrefLang: "pt-BR", href: "/" },
      { rel: "alternate", hrefLang: "ja", href: "/jp" },
      { rel: "alternate", hrefLang: "x-default", href: "/" },
    ],
  }),
  component: LandingPT,
});

function LandingPT() {
  return <LandingPage content={ptContent} lang="pt" />;
}
