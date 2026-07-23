import { createFileRoute } from "@tanstack/react-router";
import { CompleteProfilePage } from "@/components/pages/complete-profile-page";
import { completeProfileContent, profileContent, signupContent } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated/ptbr/complete-profile")({
  head: () => ({
    meta: [
      { title: completeProfileContent.pt.metaTitle },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <CompleteProfilePage
      content={completeProfileContent.pt}
      profile={profileContent.pt}
      signup={signupContent.pt}
      lang="pt"
    />
  ),
});