import { createFileRoute } from "@tanstack/react-router";
import { SignupPage } from "@/components/pages/signup-page";
import { signupContent } from "@/lib/i18n";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: signupContent.pt.metaTitle },
      { name: "description", content: signupContent.pt.metaDescription },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => <SignupPage content={signupContent.pt} lang="pt" />,
});