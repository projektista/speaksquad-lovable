import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/app-shell";

export const Route = createFileRoute("/_authenticated/checkout/return")({
  validateSearch: (search: Record<string, unknown>): { session_id?: string } => ({
    session_id: typeof search.session_id === "string" ? search.session_id : undefined,
  }),
  head: () => ({
    meta: [{ title: "Pagamento · SpeakSquad" }, { name: "robots", content: "noindex" }],
  }),
  component: ReturnPage,
});

function ReturnPage() {
  const { session_id } = Route.useSearch();
  return (
    <AppShell lang="pt" title="Pagamento" subtitle="Obrigado pela compra">
      <div className="card-hair p-6">
        {session_id ? (
          <>
            <h2 className="font-display text-xl">Pagamento concluído</h2>
            <p className="mt-2 text-sm text-muted">
              Seus créditos serão adicionados em instantes. Você pode agendar sua próxima aula agora.
            </p>
            <div className="mt-6 flex gap-3">
              <Link to="/schedule" className="btn-primary">Agendar aula</Link>
              <Link to="/dashboard" className="btn-outline">Dashboard</Link>
            </div>
          </>
        ) : (
          <p className="text-sm text-muted">Sessão não encontrada.</p>
        )}
      </div>
    </AppShell>
  );
}