import { createFileRoute } from "@tanstack/react-router";
import { LessonDetailPage } from "@/components/pages/lesson-detail-page";

export const Route = createFileRoute("/_authenticated/lessons/$id")({
  head: () => ({
    meta: [
      { title: "Aula · SpeakSquad" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: LessonRoute,
});

function LessonRoute() {
  const { id } = Route.useParams();
  return <LessonDetailPage id={id} lang="pt" />;
}