import type { ReactNode } from "react";

export function BracketFrame({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`bracket-corners ${className}`}>{children}</div>;
}
*** End Patch