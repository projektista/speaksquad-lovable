import { useEffect, useState } from "react";

type Props = {
  text: string;
  speed?: number;
  startDelay?: number;
  className?: string;
  caret?: boolean;
};

export function TypingText({ text, speed = 45, startDelay = 200, className = "", caret = true }: Props) {
  const [i, setI] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setI(text.length);
      return;
    }
    const t = setTimeout(() => setStarted(true), startDelay);
    return () => clearTimeout(t);
  }, [startDelay, text.length]);

  useEffect(() => {
    if (!started) return;
    if (i >= text.length) return;
    const t = setTimeout(() => setI((v) => v + 1), speed);
    return () => clearTimeout(t);
  }, [i, started, speed, text.length]);

  return (
    <span className={className}>
      {text.slice(0, i)}
      {caret && <span className="caret" aria-hidden />}
    </span>
  );
}
*** End Patch