import { createFileRoute } from "@tanstack/react-router";
import { LoginPage } from "@/components/pages/login-page";
import { loginContent } from "@/lib/i18n";

export const Route = createFileRoute("/jp/login")({
  head: () => ({
    meta: [
      { title: loginContent.jp.metaTitle },
      { name: "description", content: loginContent.jp.metaDescription },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => <LoginPage content={loginContent.jp} lang="jp" />,
});