import { createFileRoute } from "@tanstack/react-router";
import { TeacherPublicProfilePage } from "@/components/pages/teacher-public-profile-page";

export const Route = createFileRoute("/_authenticated/teacher-profile/$id")({
  head: () => ({
    meta: [
      { title: "先生のプロフィール · SpeakSquad" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: TeacherProfileRoute,
});

function TeacherProfileRoute() {
  const { id } = Route.useParams();
  return <TeacherPublicProfilePage id={id} lang="jp" />;
}