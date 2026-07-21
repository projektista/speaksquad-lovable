import { createFileRoute } from "@tanstack/react-router";
import { LessonsListPage } from "@/components/pages/lessons-list-page";
import { lessonsListContent } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated/ptbr/lessons/")({
  head: () => ({
    meta: [
      { title: lessonsListContent.pt.metaTitle },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => <LessonsListPage content={lessonsListContent.pt} lang="pt" />,
});