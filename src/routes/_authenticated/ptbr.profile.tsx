import { createFileRoute } from "@tanstack/react-router";
import { ProfilePage } from "@/components/pages/profile-page";
import { profileContent } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated/ptbr/profile")({
  head: () => ({
    meta: [
      { title: profileContent.pt.metaTitle },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => <ProfilePage content={profileContent.pt} lang="pt" />,
});