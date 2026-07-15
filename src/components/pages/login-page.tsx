import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { AuthFrame, Field, inputCls } from "@/components/ui/auth-frame";
import type { Lang, LoginContent } from "@/lib/i18n";

export function LoginPage({ content, lang }: { content: LoginContent; lang: Lang }) {
  const [show, setShow] = useState(false);
  const signupTo = lang === "jp" ? "/jp/signup" : "/signup";

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
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <Field label={content.emailLabel}>
          <input
            type="email"
            required
            autoComplete="email"
            placeholder={content.emailPlaceholder}
            className={inputCls}
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
        <button type="submit" className="btn-primary w-full">
          {content.submit}
        </button>
      </form>
    </AuthFrame>
  );
}