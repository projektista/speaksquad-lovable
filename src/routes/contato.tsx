import { createFileRoute } from "@tanstack/react-router";
import { ContactPage } from "@/components/pages/contact-page";
import { contactContent } from "@/lib/i18n";

export const Route = createFileRoute("/jp/contato")({
  head: () => ({
    meta: [
      { title: contactContent.jp.metaTitle },
      { name: "description", content: contactContent.jp.metaDescription },
      { property: "og:title", content: contactContent.jp.metaTitle },
      { property: "og:description", content: contactContent.jp.metaDescription },
    ],
  }),
  component: () => <ContactPage content={contactContent.jp} lang="jp" />,
});