import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/pages/legal-page";
import { termsContent } from "@/lib/legal-content";

export const Route = createFileRoute("/ptbr/terms")({
  head: () => ({
    meta: [
      { title: termsContent.pt.metaTitle },
      { name: "description", content: termsContent.pt.metaDescription },
      { property: "og:title", content: termsContent.pt.metaTitle },
      { property: "og:description", content: termsContent.pt.metaDescription },
    ],
  }),
  component: () => <LegalPage content={termsContent.pt} lang="pt" />,
});