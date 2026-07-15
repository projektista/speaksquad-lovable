import { createFileRoute } from "@tanstack/react-router";
import { SignupPage } from "@/components/pages/signup-page";
import { signupContent } from "@/lib/i18n";

export const Route = createFileRoute("/jp/signup")({
  head: () => ({
    meta: [
      { title: signupContent.jp.metaTitle },
      { name: "description", content: signupContent.jp.metaDescription },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => <SignupPage content={signupContent.jp} lang="jp" />,
});