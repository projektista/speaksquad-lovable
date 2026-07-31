import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/pages/legal-page";
import { privacyContent } from "@/lib/legal-content";

export const Route = createFileRoute("/ptbr/privacidade")({
  head: () => ({
    meta: [
      { title: privacyContent.pt.metaTitle },
      { name: "description", content: privacyContent.pt.metaDescription },
      { property: "og:title", content: privacyContent.pt.metaTitle },
      { property: "og:description", content: privacyContent.pt.metaDescription },
    ],
  }),
  component: () => <LegalPage content={privacyContent.pt} lang="pt" />,
});