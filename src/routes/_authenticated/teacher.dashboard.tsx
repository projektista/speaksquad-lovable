import { createFileRoute } from "@tanstack/react-router";
import { TeacherDashboardPage } from "@/components/pages/teacher-dashboard-page";

export const Route = createFileRoute("/_authenticated/teacher/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard do Professor · SpeakSquad" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => <TeacherDashboardPage />,
});