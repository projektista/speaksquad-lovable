import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/jp/$")({
  beforeLoad: ({ params }) => {
    const rest = params._splat ?? "";
    throw redirect({ href: rest ? `/${rest}` : "/", replace: true });
  },
});
