import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { getTeacherAvailability, setWeeklySlot } from "@/lib/teacher.functions";

type Slot = { id: string; weekday: number; start_time: string; end_time: string; active: boolean };
type State = "off" | "available" | "blocked";

const DAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

function slotState(slots: Slot[], weekday: number, hour: number): State {
  const s = slots.find(
    (x) => x.weekday === weekday && x.start_time.startsWith(String(hour).padStart(2, "0") + ":00"),
  );
  if (!s) return "off";
  return s.active ? "available" : "blocked";
}

function nextState(s: State): State {
  if (s === "off") return "available";
  if (s === "available") return "blocked";
  return "off";
}

function stateColor(s: State): string {
  if (s === "available") return "bg-[color:var(--cyan)]/30 border-[color:var(--cyan)]";
  if (s === "blocked") return "bg-[color:var(--violet)]/30 border-[color:var(--violet)]";
  return "bg-transparent border-hair";
}

export function TeacherSchedulePage() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    getTeacherAvailability().then((d) => setSlots(d as Slot[]));
  }, []);

  async function toggle(weekday: number, hour: number) {
    const key = `${weekday}-${hour}`;
    setBusy(key);
    const current = slotState(slots, weekday, hour);
    const next = nextState(current);
    try {
      await setWeeklySlot({ data: { weekday, hour, state: next } });
      const fresh = await getTeacherAvailability();
      setSlots(fresh as Slot[]);
    } finally {
      setBusy(null);
    }
  }

  return (
    <AppShell
      lang="pt"
      title="Agendamento semanal"
      subtitle="Clique numa célula para alternar: cinza (indisponível) → ciano (disponível) → violeta (bloqueado) → cinza. As mudanças valem para todas as semanas."
    >
      <div className="card-hair overflow-x-auto p-3">
        <div className="mb-3 flex gap-4 font-mono-alt text-[11px]">
          <span><span className="inline-block h-3 w-3 border border-[color:var(--cyan)] bg-[color:var(--cyan)]/30 align-middle" /> disponível</span>
          <span><span className="inline-block h-3 w-3 border border-[color:var(--violet)] bg-[color:var(--violet)]/30 align-middle" /> bloqueado</span>
          <span><span className="inline-block h-3 w-3 border border-hair align-middle" /> indisponível</span>
        </div>
        <table className="w-full table-fixed border-collapse font-mono-alt text-[11px]">
          <thead>
            <tr>
              <th className="w-16 border-b border-hair p-1 text-muted">hora</th>
              {DAYS.map((d, i) => (
                <th key={i} className="border-b border-hair p-1 text-muted">{d}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 24 }, (_, hour) => (
              <tr key={hour}>
                <td className="border-b border-hair p-1 text-right text-muted">
                  {String(hour).padStart(2, "0")}:00
                </td>
                {DAYS.map((_, weekday) => {
                  const s = slotState(slots, weekday, hour);
                  const key = `${weekday}-${hour}`;
                  return (
                    <td key={weekday} className="border-b border-hair p-0.5">
                      <button
                        type="button"
                        disabled={busy === key}
                        onClick={() => toggle(weekday, hour)}
                        className={`block h-6 w-full border ${stateColor(s)} ${busy === key ? "opacity-50" : "hover:brightness-125"}`}
                        aria-label={`${DAYS[weekday]} ${String(hour).padStart(2, "0")}:00`}
                      />
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