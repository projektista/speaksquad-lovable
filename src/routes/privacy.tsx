import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/pages/legal-page";
import { privacyContent } from "@/lib/legal-content";

export const Route = createFileRoute("/privacidade")({
  head: () => ({
    meta: [
      { title: privacyContent.jp.metaTitle },
      { name: "description", content: privacyContent.jp.metaDescription },
      { property: "og:title", content: privacyContent.jp.metaTitle },
      { property: "og:description", content: privacyContent.jp.metaDescription },
    ],
  }),
  component: () => <LegalPage content={privacyContent.jp} lang="jp" />,
});