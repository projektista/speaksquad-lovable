import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/pages/legal-page";
import { termsContent } from "@/lib/legal-content";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: termsContent.jp.metaTitle },
      { name: "description", content: termsContent.jp.metaDescription },
      { property: "og:title", content: termsContent.jp.metaTitle },
      { property: "og:description", content: termsContent.jp.metaDescription },
    ],
  }),
  component: () => <LegalPage content={termsContent.jp} lang="jp" />,
});