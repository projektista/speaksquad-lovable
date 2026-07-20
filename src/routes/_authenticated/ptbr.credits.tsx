import { createFileRoute } from "@tanstack/react-router";
import { CreditsPage } from "@/components/pages/credits-page";

export const Route = createFileRoute("/_authenticated/ptbr/credits")({
  head: () => ({
    meta: [
      { title: "Créditos · SpeakSquad" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => <CreditsPage lang="pt" />,
});