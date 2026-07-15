import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AuthFrame, Field, inputCls } from "@/components/ui/auth-frame";
import type { Lang, SignupContent } from "@/lib/i18n";

export function SignupPage({ content, lang }: { content: SignupContent; lang: Lang }) {
  const [pw, setPw] = useState("");
  const [bio, setBio] = useState("");
  const [game, setGame] = useState<"minecraft" | "fortnite" | null>(null);
  const strength = useMemo(() => {
    let s = 0;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/\d/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return s;
  }, [pw]);
  const loginTo = lang === "jp" ? "/jp/login" : "/login";

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
      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
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
            />
          </Field>
          <Field label={content.email}>
            <input
              type="email"
              required
              autoComplete="email"
              placeholder={content.emailPlaceholder}
              className={inputCls}
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
            <select required defaultValue="" className={inputCls}>
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

        <button type="submit" className="btn-primary w-full">
          {content.submit}
        </button>
      </form>
    </AuthFrame>
  );
}