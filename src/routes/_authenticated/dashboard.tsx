import { createFileRoute } from "@tanstack/react-router";
import { DashboardPage } from "@/components/pages/dashboard-page";
import { dashboardContent } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: dashboardContent.jp.metaTitle },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => <DashboardPage content={dashboardContent.jp} lang="jp" />,
});