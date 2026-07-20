import { createFileRoute } from "@tanstack/react-router";
import { ContactPage } from "@/components/pages/contact-page";
import { contactContent } from "@/lib/i18n";

export const Route = createFileRoute("/ptbr/contato")({
  head: () => ({
    meta: [
      { title: contactContent.pt.metaTitle },
      { name: "description", content: contactContent.pt.metaDescription },
      { property: "og:title", content: contactContent.pt.metaTitle },
      { property: "og:description", content: contactContent.pt.metaDescription },
    ],
  }),
  component: () => <ContactPage content={contactContent.pt} lang="pt" />,
});