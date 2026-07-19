import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { getTeacherAvailabilityRange, setSlot } from "@/lib/teacher.functions";

type State = "off" | "available" | "blocked" | "booked";

const DAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const HOURS = Array.from({ length: 18 }, (_, i) => i + 6); // 06:00 → 23:00

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
function fmtDay(d: Date) {
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}
function fmtRange(a: Date, b: Date) {
  return `${a.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })} – ${b.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}`;
}
function toIso(day: Date, hour: number) {
  const x = new Date(day);
  x.setHours(hour, 0, 0, 0);
  return x.toISOString();
}

function stateColor(s: State): string {
  if (s === "booked") return "bg-[color:var(--magenta)]/40 border-[color:var(--magenta)] text-foreground";
  if (s === "available") return "bg-[color:var(--cyan)]/25 border-[color:var(--cyan)] text-cyan";
  if (s === "blocked") return "bg-[color:var(--violet)]/25 border-[color:var(--violet)] text-violet-300";
  return "bg-transparent border-hair text-muted";
}

function nextState(s: State): State {
  if (s === "off") return "available";
  if (s === "available") return "blocked";
  return "off";
}

export function TeacherSchedulePage() {
  const today = useMemo(() => new Date(), []);
  const minWeekStart = useMemo(() => startOfWeekSunday(today), [today]);
  const [weekOffset, setWeekOffset] = useState(0);
  const weekStart = useMemo(() => addDays(minWeekStart, weekOffset * 7), [minWeekStart, weekOffset]);
  const weekEnd = useMemo(() => addDays(weekStart, 7), [weekStart]);
  const days = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart]);

  const [slotMap, setSlotMap] = useState<Record<string, "available" | "blocked">>({});
  const [bookedSet, setBookedSet] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState<string | null>(null);

  async function refresh() {
    const res = await getTeacherAvailabilityRange({
      data: { from: weekStart.toISOString(), to: weekEnd.toISOString() },
    });
    const map: Record<string, "available" | "blocked"> = {};
    for (const s of res.slots) map[new Date(s.starts_at).toISOString()] = s.status as any;
    setSlotMap(map);
    setBookedSet(new Set(res.lessons.map((l) => new Date(l.scheduled_at).toISOString())));
  }

  useEffect(() => {
    refresh().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weekOffset]);

  function cellState(day: Date, hour: number): State {
    const iso = toIso(day, hour);
    if (bookedSet.has(iso)) return "booked";
    return (slotMap[iso] as State) ?? "off";
  }

  async function toggle(day: Date, hour: number) {
    const iso = toIso(day, hour);
    const cur = cellState(day, hour);
    if (cur === "booked") return;
    if (new Date(iso).getTime() <= Date.now()) return;
    const next = nextState(cur) as "off" | "available" | "blocked";
    setBusy(iso);
    try {
      await setSlot({ data: { starts_at: iso, state: next } });
      await refresh();
    } finally {
      setBusy(null);
    }
  }

  // 3-month window (approx 13 weeks)
  const maxOffset = 13;

  return (
    <AppShell
      lang="pt"
      title="Minha agenda"
      subtitle="Clique numa célula para alternar: indisponível → disponível → bloqueado → indisponível. Aulas já reservadas aparecem em magenta e não podem ser alteradas aqui."
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <button
          className="btn-outline !py-2 text-xs"
          disabled={weekOffset <= 0}
          onClick={() => setWeekOffset((w) => Math.max(0, w - 1))}
        >
          ← Semana anterior
        </button>
        <div className="font-mono-alt text-sm text-muted">
          {fmtRange(weekStart, addDays(weekEnd, -1))}
        </div>
        <button
          className="btn-outline !py-2 text-xs"
          disabled={weekOffset >= maxOffset}
          onClick={() => setWeekOffset((w) => Math.min(maxOffset, w + 1))}
        >
          Próxima semana →
        </button>
      </div>

      <div className="card-hair overflow-x-auto p-3">
        <div className="mb-3 flex flex-wrap gap-4 font-mono-alt text-[11px]">
          <span><span className="inline-block h-3 w-3 border border-[color:var(--cyan)] bg-[color:var(--cyan)]/30 align-middle" /> disponível</span>
          <span><span className="inline-block h-3 w-3 border border-[color:var(--violet)] bg-[color:var(--violet)]/30 align-middle" /> bloqueado</span>
          <span><span className="inline-block h-3 w-3 border border-[color:var(--magenta)] bg-[color:var(--magenta)]/40 align-middle" /> reservado</span>
          <span><span className="inline-block h-3 w-3 border border-hair align-middle" /> indisponível</span>
        </div>

        <table className="w-full table-fixed border-collapse font-mono-alt text-[11px]">
          <thead>
            <tr>
              <th className="w-14 border-b border-hair p-1 text-muted">hora</th>
              {days.map((d, i) => {
                const isToday = d.toDateString() === today.toDateString();
                return (
                  <th key={i} className={`border-b border-hair p-1 ${isToday ? "text-cyan" : "text-muted"}`}>
                    <div>{DAYS[d.getDay()]}</div>
                    <div className="text-[10px] opacity-80">{fmtDay(d)}</div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {HOURS.map((hour) => (
              <tr key={hour}>
                <td className="border-b border-hair p-1 text-right text-muted">
                  {String(hour).padStart(2, "0")}:00
                </td>
                {days.map((day, di) => {
                  const iso = toIso(day, hour);
                  const s = cellState(day, hour);
                  const isPast = new Date(iso).getTime() <= Date.now();
                  return (
                    <td key={di} className="border-b border-hair p-0.5">
                      <button
                        type="button"
                        disabled={busy === iso || s === "booked" || isPast}
                        onClick={() => toggle(day, hour)}
                        className={`block h-8 w-full border ${stateColor(s)} ${
                          busy === iso ? "opacity-50" : ""
                        } ${isPast && s === "off" ? "opacity-30" : ""} ${
                          s !== "booked" && !isPast ? "hover:brightness-125" : ""
                        }`}
                        aria-label={`${DAYS[day.getDay()]} ${fmtDay(day)} ${String(hour).padStart(2, "0")}:00`}
                      >
                        <span className="text-[10px]">{String(hour).padStart(2, "0")}:00</span>
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}