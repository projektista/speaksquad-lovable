import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { SectionLabel } from "@/components/fx/section-label";
import { BracketFrame } from "@/components/fx/bracket-frame";
import { ParticleField } from "@/components/fx/particle-field";

export function AuthFrame({
  code,
  title,
  subtitle,
  children,
  footer,
}: {
  code: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-bg text-foreground">
      <ParticleField density={28} />
      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center justify-center px-5 py-12">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-8 inline-flex items-center gap-2 font-display text-sm">
            <span
              className="inline-flex h-6 w-6 items-center justify-center rounded-[3px] text-[10px] font-bold text-[#04121a]"
              style={{ background: "linear-gradient(135deg,#00d9ff,#ff006e)" }}
            >
              SS
            </span>
            speak<span className="text-cyan">squad</span>
          </Link>
          <BracketFrame className="p-7">
            <SectionLabel n={code}>{title}</SectionLabel>
            <h1 className="mt-3 font-display text-2xl md:text-3xl">{title}</h1>
            {subtitle && <p className="mt-2 text-sm text-muted">{subtitle}</p>}
            <div className="mt-6">{children}</div>
          </BracketFrame>
          {footer && <div className="mt-6 text-center text-sm text-muted">{footer}</div>}
        </div>
      </div>
    </div>
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: ReactNode;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <div className="mb-1.5 flex items-baseline justify-between font-mono-alt text-[11px] uppercase tracking-widest text-muted">
        <span>{label}</span>
        {hint && <span className="text-cyan/70 normal-case tracking-normal">{hint}</span>}
      </div>
      {children}
    </label>
  );
}

export const inputCls =
  "w-full rounded-[4px] border border-[color:var(--border2)] bg-[color:var(--bg3)] px-3 py-2.5 font-mono-alt text-sm text-foreground outline-none transition-colors placeholder:text-muted focus:border-[color:var(--cyan)]";