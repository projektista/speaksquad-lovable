import { createFileRoute } from "@tanstack/react-router";
import { CompleteProfilePage } from "@/components/pages/complete-profile-page";
import { completeProfileContent, profileContent, signupContent } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated/complete-profile")({
  head: () => ({
    meta: [
      { title: completeProfileContent.jp.metaTitle },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <CompleteProfilePage
      content={completeProfileContent.jp}
      profile={profileContent.jp}
      signup={signupContent.jp}
      lang="jp"
    />
  ),
});