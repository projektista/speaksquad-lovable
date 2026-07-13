import type { ReactNode } from "react";

export function GlitchText({
  children,
  as: Tag = "span",
  className = "",
}: {
  children: ReactNode;
  as?: "span" | "h1" | "h2" | "h3" | "div";
  className?: string;
}) {
  return <Tag className={`glitch ${className}`}>{children}</Tag>;
}
*** End Patch