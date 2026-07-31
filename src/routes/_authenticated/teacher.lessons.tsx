import { createFileRoute } from "@tanstack/react-router";
import { TeacherLessonsPage } from "@/components/pages/teacher-lessons-page";

export const Route = createFileRoute("/_authenticated/teacher/aulas")({
  head: () => ({
    meta: [
      { title: "Todas as aulas · SpeakSquad" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => <TeacherLessonsPage />,
});