import { Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AuthFrame, Field, inputCls } from "@/components/ui/auth-frame";
import type { Lang, SignupContent } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

export function SignupPage({ content, lang }: { content: SignupContent; lang: Lang }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [level, setLevel] = useState("");
  const [bio, setBio] = useState("");
  const [game, setGame] = useState<"minecraft" | "fortnite" | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sentMsg, setSentMsg] = useState<string | null>(null);
  const navigate = useNavigate();
  const strength = useMemo(() => {
    let s = 0;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/\d/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return s;
  }, [pw]);
  const loginTo = lang === "jp" ? "/jp/login" : "/login";
  const dashTo = lang === "jp" ? "/jp/dashboard" : "/dashboard";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSentMsg(null);
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password: pw,
      options: {
        emailRedirectTo: `${window.location.origin}${dashTo}`,
        data: { name },
      },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    // If confirm-email is on, session will be null
    if (data.session) {
      // Update profile with extras
      if (data.user) {
        await supabase
          .from("profiles")
          .update({
            name,
            english_level: (level || null) as
              | "beginner"
              | "intermediate"
              | "advanced"
              | null,
            bio: bio || null,
            preferred_game: game,
          })
          .eq("id", data.user.id);
      }
      setLoading(false);
      navigate({ to: dashTo });
      return;
    }
    setLoading(false);
    setSentMsg(
      lang === "jp"
        ? "確認メールを送信しました。メールを確認してリンクをクリックしてください。"
        : "Enviamos um email de confirmação. Clique no link para ativar sua conta.",
    );
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
      code="auth_02"
      title={content.title}
      subtitle={content.subtitle}
      footer={
        <>
          {content.hasAccount}{" "}
          <Link to={loginTo} className="text-cyan hover:text-magenta">
            {content.login}
          </Link>
        </>
      }
    >
      <form className="space-y-6" onSubmit={onSubmit}>
        <section className="space-y-4">
          <div className="font-mono-alt text-[11px] uppercase tracking-widest text-violet">
            {content.sectionAccount}
          </div>
          <Field label={content.name}>
            <input
              type="text"
              required
              autoComplete="name"
              placeholder={content.namePlaceholder}
              className={inputCls}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Field>
          <Field label={content.email}>
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
            label={content.password}
            hint={`${content.strengthLabel}: ${content.strengths[strength] ?? content.strengths[0]}`}
          >
            <input
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder={content.passwordPlaceholder}
              className={inputCls}
            />
            <div className="mt-2 flex gap-1">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded ${
                    i < strength
                      ? strength >= 3
                        ? "bg-[color:var(--success)]"
                        : "bg-[color:var(--cyan)]"
                      : "bg-[color:var(--bg3)]"
                  }`}
                />
              ))}
            </div>
          </Field>
        </section>

        <div className="hair-divider" />

        <section className="space-y-4">
          <div className="font-mono-alt text-[11px] uppercase tracking-widest text-violet">
            {content.sectionProfile}
          </div>
          <Field label={content.level}>
            <select
              required
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className={inputCls}
            >
              <option value="" disabled>
                {content.levelPlaceholder}
              </option>
              {content.levelOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label={content.bio} hint={`${bio.length}/300`}>
            <textarea
              maxLength={300}
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder={content.bioPlaceholder}
              className={`${inputCls} resize-none`}
            />
          </Field>
          <Field label={content.game}>
            <div className="grid grid-cols-2 gap-3">
              {(["minecraft", "fortnite"] as const).map((g) => {
                const active = game === g;
                return (
                  <button
                    type="button"
                    key={g}
                    onClick={() => setGame(g)}
                    className={`card-hair p-4 text-left transition-all ${
                      active ? "border-[color:var(--cyan)] bg-[color:var(--bg3)]" : ""
                    }`}
                  >
                    <div className="font-mono-alt text-[10px] uppercase tracking-widest text-muted">
                      [{active ? "×" : " "}]
                    </div>
                    <div className="mt-1 font-display text-base capitalize">{g}</div>
                    <div className="mt-1 font-mono-alt text-[11px] text-muted">
                      {g === "minecraft" ? content.minecraftTag : content.fortniteTag}
                    </div>
                  </button>
                );
              })}
            </div>
          </Field>
        </section>

        {error && (
          <div className="rounded-[3px] border border-[color:var(--magenta)] bg-[color:var(--bg3)] p-2 font-mono-alt text-xs text-magenta">
            {error}
          </div>
        )}
        {sentMsg && (
          <div className="rounded-[3px] border border-[color:var(--cyan)] bg-[color:var(--bg3)] p-2 font-mono-alt text-xs text-cyan">
            {sentMsg}
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