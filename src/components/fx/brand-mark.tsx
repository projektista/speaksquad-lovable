import { Link } from "@tanstack/react-router";

type Size = "sm" | "md" | "lg";

export function BrandMark({
  to = "/",
  size = "md",
  className = "",
}: {
  to?: string;
  size?: Size;
  className?: string;
}) {
  const badge =
    size === "sm"
      ? "h-6 w-6 text-[10px] rounded-[3px]"
      : size === "lg"
        ? "h-8 w-8 text-[12px] rounded-[4px]"
        : "h-7 w-7 text-[11px] rounded-[4px]";
  const text =
    size === "sm" ? "text-sm" : size === "lg" ? "text-xl" : "text-lg";

  return (
    <Link
      to={to}
      className={`group brand-link glitch inline-flex items-center gap-2 font-display ${text} ${className}`}
    >
      <span
        className={`inline-flex items-center justify-center font-bold text-[#04121a] ${badge}`}
        style={{ background: "linear-gradient(135deg,#00d9ff,#ff006e)" }}
      >
        SS
      </span>
      <span className="brand-text whitespace-nowrap decoration-2 underline-offset-4 group-hover:underline group-hover:decoration-[#00d9ff]">
        <span style={{ color: "#f7fafc" }}>Speak</span>
        <span style={{ color: "#ff006e" }}>Squad</span>
      </span>
    </Link>
  );
}