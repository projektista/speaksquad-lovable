import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Reveal } from "@/components/fx/reveal";
import type { Lang, ScheduleContent } from "@/lib/i18n";

const SLOTS_BY_DAY: Record<number, string[]> = {
  0: ["18:00", "19:00", "20:00"],
  1: ["17:00", "18:00"],
  2: [],
  3: ["18:00", "19:00", "21:00"],
  4: ["17:00", "20:00"],
  5: ["10:00", "11:00", "14:00"],
  6: [],
};

export function SchedulePage({ content, lang }: { content: ScheduleContent; lang: Lang }) {
  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [mode, setMode] = useState<"minecraft" | "fortnite">("minecraft");
  const [confirmed, setConfirmed] = useState(false);

  const slots = SLOTS_BY_DAY[selectedDay] ?? [];

  return (
    <AppShell lang={lang} title={content.title} subtitle={content.subtitle} credits={3}>
      <Reveal>
        <div className="card-hair p-5">
          <div className="section-label">{content.weekLabel}</div>
          <div className="mt-2 font-mono-alt text-xs text-muted">{content.monthLabel}</div>
          <div className="mt-4 grid grid-cols-7 gap-2">
            {content.days.map((d, i) => {
              const active = selectedDay === i;
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => {
                    setSelectedDay(i);
                    setSelectedSlot(null);
                    setConfirmed(false);
                  }}
                  className={`rounded-[4px] border px-2 py-3 text-center font-mono-alt text-xs transition-colors ${
                    active
                      ? "border-[color:var(--cyan)] bg-[color:var(--bg3)] text-cyan"
                      : "border-hair text-muted hover:text-foreground"
                  }`}
                >
                  <div>{d}</div>
                  <div className="mt-1 font-display text-lg text-foreground">{13 + i}</div>
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
            {(["minecraft", "fortnite"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`rounded-[4px] border px-3 py-2 font-mono-alt text-xs transition-colors ${
                  mode === m
                    ? "border-[color:var(--cyan)] bg-[color:var(--bg3)] text-cyan"
                    : "border-hair text-muted hover:text-foreground"
                }`}
              >
                {content.modes[m]}
              </button>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal delay={160}>
        <div className="card-hair mt-6 p-5">
          <div className="section-label">{content.slotsLabel}</div>
          {slots.length === 0 ? (
            <p className="mt-4 font-mono-alt text-sm text-muted">{content.noSlots}</p>
          ) : (
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {slots.map((s) => {
                const active = selectedSlot === s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      setSelectedSlot(s);
                      setConfirmed(false);
                    }}
                    className={`rounded-[4px] border px-3 py-3 font-mono-alt text-sm transition-colors ${
                      active
                        ? "border-[color:var(--cyan)] bg-[color:var(--bg3)] text-cyan"
                        : "border-hair text-muted hover:text-foreground"
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </Reveal>

      <Reveal delay={220}>
        <div className="mt-6 flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between">
          <button
            type="button"
            disabled={!selectedSlot}
            onClick={() => setConfirmed(true)}
            className="btn-primary disabled:opacity-40"
          >
            {content.confirmCta}
          </button>
          {confirmed && (
            <div className="font-mono-alt text-sm text-cyan">{content.confirmedMsg}</div>
          )}
        </div>
      </Reveal>
    </AppShell>
  );
}
