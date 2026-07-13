import { useEffect, useRef, useState, createElement, type ReactNode, type CSSProperties, type ElementType } from "react";

type Props = {
  children: ReactNode;
  delay?: number;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
};

export function Reveal({ children, delay = 0, as = "div", className = "", style }: Props) {
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
      className: `ss-reveal ${visible ? "is-visible" : ""} ${className}`.trim(),
      style: { animationDelay: `${delay}ms`, ...style },
    },
    children,
  );
}