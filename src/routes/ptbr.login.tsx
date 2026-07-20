import { createFileRoute } from "@tanstack/react-router";
import { LoginPage } from "@/components/pages/login-page";
import { loginContent } from "@/lib/i18n";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: loginContent.pt.metaTitle },
      { name: "description", content: loginContent.pt.metaDescription },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => <LoginPage content={loginContent.pt} lang="pt" />,
});