import { useEffect, useRef, useState, createElement, type ReactNode, type CSSProperties, type ElementType } from "react";

type Variant = "fade-up" | "fade" | "slide-left" | "slide-right" | "parallax" | "clip";

type Props = {
  children: ReactNode;
  delay?: number;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  variant?: Variant;
};

export function Reveal({ children, delay = 0, as = "div", className = "", style, variant = "fade-up" }: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setVisible(true);
            io.disconnect();
            break;
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return createElement(
    as,
    {
      ref,
      className: `ss-reveal ss-reveal--${variant} ${visible ? "is-visible" : ""} ${className}`.trim(),
      style: { animationDelay: `${delay}ms`, ...style },
    },
    children,
  );
}