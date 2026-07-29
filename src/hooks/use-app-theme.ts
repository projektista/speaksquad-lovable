import { useCallback, useEffect, useState } from "react";

export type AppTheme = "dark" | "light";
const STORAGE_KEY = "speaksquad_app_theme";

/** Theme for internal (post-login) pages only. Defaults to dark. */
export function useAppTheme() {
  const [theme, setTheme] = useState<AppTheme>("dark");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "light" || stored === "dark") setTheme(stored);
    } catch {
      /* storage unavailable */
    }
  }, []);

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next: AppTheme = prev === "dark" ? "light" : "dark";
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* storage unavailable */
      }
      return next;
    });
  }, []);

  return { theme, toggle };
}