import { createFileRoute } from "@tanstack/react-router";
import { LessonsListPage } from "@/components/pages/lessons-list-page";
import { lessonsListContent } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated/lessons/")({
  head: () => ({
    meta: [
      { title: lessonsListContent.jp.metaTitle },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => <LessonsListPage content={lessonsListContent.jp} lang="jp" />,
});