import { createFileRoute } from "@tanstack/react-router";
import { TeacherSchedulePage } from "@/components/pages/teacher-schedule-page";

export const Route = createFileRoute("/_authenticated/teacher/agendamento")({
  head: () => ({
    meta: [
      { title: "Agendamento · SpeakSquad" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => <TeacherSchedulePage />,
});