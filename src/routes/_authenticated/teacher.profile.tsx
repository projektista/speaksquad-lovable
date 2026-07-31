import { createFileRoute } from "@tanstack/react-router";
import { TeacherProfilePage } from "@/components/pages/teacher-profile-page";

export const Route = createFileRoute("/_authenticated/teacher/profile")({
  head: () => ({
    meta: [
      { title: "Perfil professor · SpeakSquad" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => <TeacherProfilePage />,
});