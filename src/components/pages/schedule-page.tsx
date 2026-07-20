import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/app-shell";
import { Reveal } from "@/components/fx/reveal";
import type { Lang, ScheduleContent } from "@/lib/i18n";
import { getAvailableSlotsRange, bookLesson, getMyOverview } from "@/lib/booking.functions";

function startOfWeekSunday(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  x.setDate(x.getDate() - x.getDay());
  return x;
}
function addDays(d: Date, n: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

type Slot = { id: string; starts_at: string; teacher_id: string };

export function SchedulePage({ content, lang }: { content: ScheduleContent; lang: Lang }) {
  const navigate = useNavigate();
  const today = useMemo(() => new Date(), []);
  const minWeekStart = useMemo(() => startOfWeekSunday(today), [today]);
  const [weekOffset, setWeekOffset] = useState(0);
  const weekStart = useMemo(() => addDays(minWeekStart, weekOffset * 7), [minWeekStart, weekOffset]);
  const weekEnd = useMemo(() => addDays(weekStart, 7), [weekStart]);
  const days = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart]);

  const [selectedDayIdx, setSelectedDayIdx] = useState(0);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [mode, setMode] = useState<"minecraft" | "fortnite">("minecraft");
  const [pickedSlot, setPickedSlot] = useState<Slot | null>(null);
  const [available, setAvailable] = useState<number>(0);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    getMyOverview().then((o) => setAvailable(o.available)).catch(() => {});
  }, []);

  useEffect(() => {
    setPickedSlot(null);
    setErr(null);
    getAvailableSlotsRange({
      data: { from: weekStart.toISOString(), to: weekEnd.toISOString() },
    })
      .then((rows) => setSlots(rows as Slot[]))
      .catch((e) => setErr(e.message ?? String(e)));
  }, [weekOffset]);

  const slotsToday = slots.filter(
    (s) => new Date(s.starts_at).toDateString() === days[selectedDayIdx].toDateString(),
  );

  async function confirmBooking() {
    if (!pickedSlot) return;
    setBusy(true);
    setErr(null);
    try {
      const res = await bookLesson({ data: { starts_at: pickedSlot.starts_at, mode } });
      const path = lang === "jp" ? `/lessons/${res.lessonId}` : `/ptbr/lessons/${res.lessonId}`;
      navigate({ to: path });
    } catch (e: any) {
      setErr(e.message ?? String(e));
    } finally {
      setBusy(false);
    }
  }

  const locale = lang === "jp" ? "ja-JP" : "pt-BR";
  const rangeLabel = `${weekStart.toLocaleDateString(locale, { day: "2-digit", month: "short" })} – ${addDays(weekEnd, -1).toLocaleDateString(locale, { day: "2-digit", month: "short" })}`;

  const modalCopy = {
    pt: {
      title: "Confirmar agendamento",
      p1: "Você está reservando 1 crédito para esta aula.",
      p2: "Política: cancelamento até 6h antes devolve o crédito. Após esse prazo ou no-show, o crédito é consumido. Se o professor cancelar, o crédito volta e ganha 30 dias extras de validade.",
      confirm: "Reservar aula",
      cancel: "Voltar",
    },
    jp: {
      title: "予約を確定",
      p1: "このレッスンに1クレジットを使用します。",
      p2: "ポリシー: 6時間前までのキャンセルはクレジット返却。それ以降または無断欠席は消費されます。講師都合の場合は常に返却され、有効期限が30日延長されます。",
      confirm: "予約する",
      cancel: "戻る",
    },
  } as const;
  const m = modalCopy[lang];

  return (
    <AppShell lang={lang} title={content.title} subtitle={content.subtitle} credits={available}>
      <Reveal>
        <div className="card-hair p-5">
          <div className="flex items-center justify-between gap-3">
            <button
              className="btn-outline !py-1 text-xs"
              disabled={weekOffset <= 0}
              onClick={() => setWeekOffset((w) => Math.max(0, w - 1))}
            >
              ← {lang === "jp" ? "前週" : "Semana anterior"}
            </button>
            <div className="section-label !text-center">{rangeLabel}</div>
            <button
              className="btn-outline !py-1 text-xs"
              disabled={weekOffset >= 13}
              onClick={() => setWeekOffset((w) => Math.min(13, w + 1))}
            >
              {lang === "jp" ? "次週" : "Próxima semana"} →
            </button>
          </div>
          <div className="mt-4 grid grid-cols-7 gap-2">
            {days.map((d, i) => {
              const active = selectedDayIdx === i;
              const count = slots.filter((s) => new Date(s.starts_at).toDateString() === d.toDateString()).length;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedDayIdx(i)}
                  className={`rounded-[4px] border px-2 py-3 text-center font-mono-alt text-xs transition-colors ${
                    active
                      ? "border-[color:var(--cyan)] bg-[color:var(--bg3)] text-cyan"
                      : "border-hair text-muted hover:text-foreground"
                  }`}
                >
                  <div>{d.toLocaleDateString(locale, { weekday: "short" })}</div>
                  <div className="mt-1 font-display text-lg text-foreground">{d.getDate()}</div>
                  <div className="mt-1 text-[10px] opacity-70">{count}</div>
                </button>
              );
            })}
          </div>
        </div>
      </Reveal>

      <Reveal delay={80}>
        <div className="card-hair mt-6 p-5">
          <div className="section-label">{content.modeLabel}</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {(["minecraft", "fortnite"] as const).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setMode(k)}
                className={`rounded-[4px] border px-3 py-2 font-mono-alt text-xs transition-colors ${
                  mode === k
                    ? "border-[color:var(--cyan)] bg-[color:var(--bg3)] text-cyan"
                    : "border-hair text-muted hover:text-foreground"
                }`}
              >
                {content.modes[k]}
              </button>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal delay={160}>
        <div className="card-hair mt-6 p-5">
          <div className="section-label">{content.slotsLabel}</div>
          {slotsToday.length === 0 ? (
            <p className="mt-4 font-mono-alt text-sm text-muted">{content.noSlots}</p>
          ) : (
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {slotsToday.map((s) => {
                const t = new Date(s.starts_at).toLocaleTimeString(locale, {
                  hour: "2-digit",
                  minute: "2-digit",
                });
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setPickedSlot(s)}
                    className="rounded-[4px] border border-hair px-3 py-3 font-mono-alt text-sm text-muted transition-colors hover:border-[color:var(--cyan)] hover:text-cyan"
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </Reveal>

      {err && <div className="mt-4 text-sm text-magenta">{err}</div>}

      {pickedSlot && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => !busy && setPickedSlot(null)}
        >
          <div className="card-hair w-full max-w-md bg-bg2 p-6" onClick={(e) => e.stopPropagation()}>
            <div className="section-label">// {m.title}</div>
            <h2 className="mt-2 font-display text-xl">
              {new Date(pickedSlot.starts_at).toLocaleString(locale, {
                weekday: "long",
                day: "2-digit",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </h2>
            <div className="mt-1 font-mono-alt text-xs text-muted">
              {content.modes[mode]} · 50 min
            </div>
            <p className="mt-3 text-sm">{m.p1}</p>
            <p className="mt-2 text-sm text-muted">{m.p2}</p>
            {err && <div className="mt-3 text-sm text-magenta">{err}</div>}
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" disabled={busy} onClick={() => setPickedSlot(null)} className="btn-outline !py-2 text-xs">
                {m.cancel}
              </button>
              <button
                type="button"
                disabled={busy || available < 1}
                onClick={confirmBooking}
                className="btn-primary !py-2 text-xs disabled:opacity-40"
              >
                {available < 1 ? (lang === "jp" ? "クレジット不足" : "Sem créditos") : m.confirm}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}