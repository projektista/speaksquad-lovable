import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/app-shell";

export const Route = createFileRoute("/_authenticated/checkout/return")({
  validateSearch: (search: Record<string, unknown>): { session_id?: string } => ({
    session_id: typeof search.session_id === "string" ? search.session_id : undefined,
  }),
  head: () => ({
    meta: [{ title: "お支払い · SpeakSquad" }, { name: "robots", content: "noindex" }],
  }),
  component: ReturnPage,
});

function ReturnPage() {
  const { session_id } = Route.useSearch();
  return (
    <AppShell lang="jp" title="お支払い" subtitle="ご購入ありがとうございます">
      <div className="card-hair p-6">
        {session_id ? (
          <>
            <h2 className="font-display text-xl">お支払い完了</h2>
            <p className="mt-2 text-sm text-muted">
              クレジットはまもなく追加されます。今すぐ次のレッスンを予約できます。
            </p>
            <div className="mt-6 flex gap-3">
              <Link to="/schedule" className="btn-primary">予約する</Link>
              <Link to="/dashboard" className="btn-outline">ダッシュボード</Link>
            </div>
          </>
        ) : (
          <p className="text-sm text-muted">セッションが見つかりません。</p>
        )}
      </div>
    </AppShell>
  );
}