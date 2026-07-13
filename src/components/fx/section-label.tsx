import type { ReactNode } from "react";

export function SectionLabel({ n, children }: { n?: string; children: ReactNode }) {
  return (
    <span className="section-label">
      <span className="text-cyan opacity-60">//</span>
      {n && <span className="text-muted">{n}</span>}
      <span>{children}</span>
    </span>
  );
}
