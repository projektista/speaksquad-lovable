import { createFileRoute } from "@tanstack/react-router";
import { CreditsPage } from "@/components/pages/credits-page";

export const Route = createFileRoute("/_authenticated/jp/credits")({
  head: () => ({
    meta: [
      { title: "クレジット · SpeakSquad" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => <CreditsPage lang="jp" />,
});