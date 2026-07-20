import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/jp/")({
  beforeLoad: () => {
    throw redirect({ to: "/", replace: true });
  },
});
