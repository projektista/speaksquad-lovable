import { createFileRoute } from "@tanstack/react-router";
import { SchedulePage } from "@/components/pages/schedule-page";
import { scheduleContent } from "@/lib/i18n";

export const Route = createFileRoute("/schedule")({
  head: () => ({
    meta: [
      { title: scheduleContent.pt.metaTitle },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => <SchedulePage content={scheduleContent.pt} lang="pt" />,
});
