import { useEffect, useRef, useState } from "react";

const CHARS = "!<>-_\\/[]{}—=+*^?#01ABCDEF¥$";

export function ScrambleText({
  text,
  duration = 900,
  className = "",
  trigger = "view",
}: {
  text: string;
  duration?: number;
  className?: string;
  trigger?: "view" | "mount";
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [out, setOut] = useState(text);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOut(text);
      return;
    }
    let raf = 0;
    let start = 0;
    const run = () => {
      const step = (t: number) => {
        if (!start) start = t;
        const p = Math.min(1, (t - start) / duration);
        const revealed = Math.floor(p * text.length);
        let s = "";
        for (let i = 0; i < text.length; i++) {
          if (i < revealed) s += text[i];
          else if (text[i] === " ") s += " ";
          else s += CHARS[Math.floor(Math.random() * CHARS.length)];
        }
        setOut(s);
        if (p < 1) raf = requestAnimationFrame(step);
        else setOut(text);
      };
      raf = requestAnimationFrame(step);
    };

    if (trigger === "mount") {
      run();
      return () => cancelAnimationFrame(raf);
    }

    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            run();
            io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [text, duration, trigger]);

  return (
    <span ref={ref} className={`font-mono-alt ${className}`}>
      {out}
    </span>
  );
}