import { createFileRoute } from "@tanstack/react-router";
import { TeacherPublicProfilePage } from "@/components/pages/teacher-public-profile-page";

export const Route = createFileRoute("/_authenticated/ptbr/teacher-profile/$id")({
  head: () => ({
    meta: [
      { title: "Perfil do professor · SpeakSquad" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: TeacherProfileRoute,
});

function TeacherProfileRoute() {
  const { id } = Route.useParams();
  return <TeacherPublicProfilePage id={id} lang="pt" />;
}