import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AuthFrame, Field, inputCls } from "@/components/ui/auth-frame";
import type { Lang, LoginContent } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

export function LoginPage({ content, lang }: { content: LoginContent; lang: Lang }) {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const signupTo = lang === "jp" ? "/jp/signup" : "/signup";
  const dashTo = lang === "jp" ? "/jp/dashboard" : "/dashboard";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    navigate({ to: dashTo });
  }

  async function onGoogle() {
    setError(null);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setError(result.error.message ?? String(result.error));
      return;
    }
    if (result.redirected) return;
    navigate({ to: dashTo });
  }

  return (
    <AuthFrame
      lang={lang}
      code="auth_01"
      title={content.title}
      subtitle={content.subtitle}
      footer={
        <>
          {content.noAccount}{" "}
          <Link to={signupTo} className="text-cyan hover:text-magenta">
            {content.createAccount}
          </Link>
        </>
      }
    >
      <form className="space-y-4" onSubmit={onSubmit}>
        <Field label={content.emailLabel}>
          <input
            type="email"
            required
            autoComplete="email"
            placeholder={content.emailPlaceholder}
            className={inputCls}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>
        <Field
          label={content.passwordLabel}
          hint={
            <button type="button" onClick={() => setShow((v) => !v)} className="hover:text-cyan">
              {show ? content.hide : content.show}
            </button>
          }
        >
          <input
            type={show ? "text" : "password"}
            required
            autoComplete="current-password"
            placeholder={content.passwordPlaceholder}
            className={inputCls}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>
        <div className="flex items-center justify-between font-mono-alt text-xs">
          <label className="flex items-center gap-2 text-muted">
            <input type="checkbox" className="accent-[color:var(--cyan)]" /> {content.remember}
          </label>
          <a href="#" className="text-cyan hover:text-magenta">
            {content.forgot}
          </a>
        </div>
        {error && (
          <div className="rounded-[3px] border border-[color:var(--magenta)] bg-[color:var(--bg3)] p-2 font-mono-alt text-xs text-magenta">
            {error}
          </div>
        )}
        <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
          {loading ? "..." : content.submit}
        </button>
        <div className="relative py-2 text-center font-mono-alt text-[10px] uppercase tracking-widest text-muted">
          <span className="bg-[color:var(--bg2)] px-2">or</span>
          <span className="absolute inset-x-0 top-1/2 -z-10 h-px bg-hair" />
        </div>
        <button
          type="button"
          onClick={onGoogle}
          className="btn-outline w-full flex items-center justify-center gap-2"
        >
          <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden>
            <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.8 32.9 29.4 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/>
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
            <path fill="#4CAF50" d="M24 44c5.4 0 10.3-2.1 14-5.4l-6.5-5.4C29.6 34.7 26.9 36 24 36c-5.3 0-9.8-3.1-11.3-7.5l-6.6 5.1C9.5 39.6 16.2 44 24 44z"/>
            <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.3-4.1 5.7l6.5 5.4C41.9 35.7 44 30.2 44 24c0-1.3-.1-2.4-.4-3.5z"/>
          </svg>
          Google
        </button>
      </form>
    </AuthFrame>
  );
}