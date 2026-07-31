import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Field, inputCls } from "@/components/ui/auth-frame";
import { getStudentDetail, grantStudentCredits } from "@/lib/teacher.functions";

type Detail = Awaited<ReturnType<typeof getStudentDetail>>;

export const Route = createFileRoute("/_authenticated/teacher/alunos/$id")({
  component: TeacherStudentDetailPage,
});

function defaultExpiry(): string {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d.toISOString().slice(0, 10);
}

function TeacherStudentDetailPage() {
  const { id } = Route.useParams();
  const [data, setData] = useState<Detail | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const [qty, setQty] = useState("1");
  const [expiry, setExpiry] = useState(defaultExpiry());
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);

  async function reload() {
    try {
      const d = await getStudentDetail({ data: { studentId: id } });
      setData(d);
    } catch (e: any) {
      setErr(e.message ?? String(e));
    }
  }

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function onGrant(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFlash(null);
    try {
      const res = await grantStudentCredits({
        data: {
          studentId: id,
          quantity: Number(qty),
          expiresAt: new Date(expiry + "T23:59:59").toISOString(),
          note,
        },
      });
      setFlash(`+${res.granted} crédito(s) concedido(s).`);
      setNote("");
      setQty("1");
      setExpiry(defaultExpiry());
      await reload();
    } catch (e: any) {
      setFlash(`Erro: ${e.message ?? String(e)}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <AppShell
      lang="pt"
      title={data?.profile?.name || "Aluno"}
      subtitle={data?.email || undefined}
    >
      <div className="mb-4">
        <Link to="/teacher/alunos" className="font-mono-alt text-xs text-muted hover:text-cyan">
          ← voltar
        </Link>
      </div>
      {err && <div className="card-hair p-4 text-magenta">{err}</div>}
      {!data && !err && <div className="text-muted">carregando...</div>}
      {data && (
        <div className="grid gap-6 md:grid-cols-3">
          <section className="card-hair p-4 md:col-span-1">
            <div className="section-label mb-3">// resumo</div>
            <dl className="space-y-2 text-sm">
              <Info k="Disponíveis" v={String(data.summary.available ?? 0)} />
              <Info k="Reservados" v={String(data.summary.reserved ?? 0)} />
              <Info
                k="Próxima expiração"
                v={
                  data.summary.next_expiration
                    ? new Date(data.summary.next_expiration).toLocaleDateString("pt-BR")
                    : "—"
                }
              />
              <Info k="Nível" v={data.profile?.english_level ?? "—"} />
              <Info k="Objetivo" v={data.profile?.learning_goal ?? "—"} />
              <Info k="Interesses" v={data.profile?.interests ?? "—"} />
              <Info k="Minecraft" v={data.profile?.minecraft_gamertag ?? "—"} />
              <Info k="Fortnite" v={data.profile?.fortnite_nickname ?? "—"} />
            </dl>
          </section>

          <section className="card-hair p-4 md:col-span-2">
            <div className="section-label mb-3">// conceder crédito manual</div>
            <form onSubmit={onGrant} className="space-y-3">
              <div className="grid gap-3 md:grid-cols-2">
                <Field label="Quantidade">
                  <input
                    className={inputCls}
                    type="number"
                    min={1}
                    max={100}
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                  />
                </Field>
                <Field label="Expira em">
                  <input
                    className={inputCls}
                    type="date"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                  />
                </Field>
              </div>
              <Field label="Motivo / nota (obrigatório)">
                <input
                  className={inputCls}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Ex: bônus, reembolso manual, cortesia..."
                  required
                />
              </Field>
              <div className="flex items-center gap-3">
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? "..." : "Conceder"}
                </button>
                {flash && <span className="text-sm text-cyan">{flash}</span>}
              </div>
            </form>
          </section>

          <section className="card-hair p-4 md:col-span-3">
            <div className="section-label mb-3">// histórico de lotes</div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-bg2 font-mono-alt text-[11px] uppercase tracking-widest text-muted">
                  <tr>
                    <th className="px-3 py-2 text-left">Criado</th>
                    <th className="px-3 py-2 text-left">Status</th>
                    <th className="px-3 py-2 text-left">Origem</th>
                    <th className="px-3 py-2 text-left">Expira</th>
                    <th className="px-3 py-2 text-left">Nota</th>
                  </tr>
                </thead>
                <tbody>
                  {data.lots.map((l: any) => (
                    <tr key={l.id} className="border-t border-hair">
                      <td className="px-3 py-2 text-muted">
                        {new Date(l.created_at).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="px-3 py-2">
                        <StatusPill status={l.status} />
                      </td>
                      <td className="px-3 py-2 text-muted">{l.source}</td>
                      <td className="px-3 py-2 text-muted">
                        {new Date(l.expires_at).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="px-3 py-2 text-muted">{l.note ?? "—"}</td>
                    </tr>
                  ))}
                  {data.lots.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-3 py-6 text-center text-muted">
                        Nenhum lote de crédito.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}
    </AppShell>
  );
}

function Info({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-3 border-b border-hair pb-1 last:border-0">
      <dt className="text-muted">{k}</dt>
      <dd className="text-right">{v}</dd>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const cls =
    status === "available"
      ? "text-cyan"
      : status === "reserved"
        ? "text-magenta"
        : status === "consumed"
          ? "text-muted"
          : status === "expired"
            ? "text-muted line-through"
            : "text-muted";
  return <span className={`font-mono-alt text-xs ${cls}`}>{status}</span>;
}