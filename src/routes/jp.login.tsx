import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AuthFrame, Field, inputCls } from "@/components/ui/auth-frame";

export const Route = createFileRoute("/jp/login")({
  head: () => ({
    meta: [
      { title: "ログイン — SpeakSquad" },
      { name: "description", content: "SpeakSquadアカウントにログイン。" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: LoginJP,
});

function LoginJP() {
  const [show, setShow] = useState(false);
  return (
    <AuthFrame
      lang="jp"
      code="auth_01"
      title="ログイン"
      subtitle="おかえりなさい。学習を続けましょう。"
      footer={
        <>
          アカウントをお持ちでない方は{" "}
          <Link to="/jp/signup" className="text-cyan hover:text-magenta">
            新規登録
          </Link>
        </>
      }
    >
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <Field label="メール">
          <input type="email" required autoComplete="email" placeholder="your@email.com" className={inputCls} />
        </Field>
        <Field
          label="パスワード"
          hint={
            <button type="button" onClick={() => setShow((v) => !v)} className="hover:text-cyan">
              {show ? "非表示" : "表示"}
            </button>
          }
        >
          <input
            type={show ? "text" : "password"}
            required
            autoComplete="current-password"
            placeholder="••••••••"
            className={inputCls}
          />
        </Field>
        <div className="flex items-center justify-between font-mono-alt text-xs">
          <label className="flex items-center gap-2 text-muted">
            <input type="checkbox" className="accent-[color:var(--cyan)]" /> ログイン状態を保持
          </label>
          <a href="#" className="text-cyan hover:text-magenta">パスワードを忘れた</a>
        </div>
        <button type="submit" className="btn-primary w-full">ログイン</button>
      </form>
    </AuthFrame>
  );
}