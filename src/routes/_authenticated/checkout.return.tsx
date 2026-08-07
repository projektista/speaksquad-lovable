import { createFileRoute } from "@tanstack/react-router";
import { CheckoutReturnPage } from "@/components/pages/checkout-return-page";

export const Route = createFileRoute("/_authenticated/checkout/return")({
  validateSearch: (search: Record<string, unknown>): { session_id?: string } => ({
    session_id: typeof search.session_id === "string" ? search.session_id : undefined,
  }),
  head: () => ({
    meta: [{ title: "お支払い · SpeakSquad" }, { name: "robots", content: "noindex" }],
  }),
  component: () => <CheckoutReturnPage lang="jp" sessionId={Route.useSearch().session_id} />,
});
