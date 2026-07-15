import { createFileRoute } from "@tanstack/react-router";
import { DashboardPage } from "@/components/pages/dashboard-page";
import { dashboardContent } from "@/lib/i18n";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: dashboardContent.pt.metaTitle },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => <DashboardPage content={dashboardContent.pt} lang="pt" />,
});