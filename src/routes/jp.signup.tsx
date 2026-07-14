import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AuthFrame, Field, inputCls } from "@/components/ui/auth-frame";

export const Route = createFileRoute("/jp/signup")({
  head: () => ({
    meta: [
      { title: "新規登録 — SpeakSquad" },
      {
        name: "description",
        content: "無料体験レッスンのためのアカウントを作成しましょう。",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SignupJP,
});

function SignupJP() {
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

  const strengthLabel = ["弱い", "普通", "良い", "強い", "非常に強い"][strength] ?? "弱い";

  return (
    <AuthFrame
      lang="jp"
      code="auth_02"
      title="新規登録"
      subtitle="初回レッスン無料。カード不要。"
      footer={
        <>
          すでにアカウントをお持ちですか?{" "}
          <Link to="/jp/login" className="text-cyan hover:text-magenta">ログイン</Link>
        </>
      }
    >
      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        <section className="space-y-4">
          <div className="font-mono-alt text-[11px] uppercase tracking-widest text-violet">// account_info</div>
          <Field label="お名前">
            <input type="text" required autoComplete="name" placeholder="お名前" className={inputCls} />
          </Field>
          <Field label="メール">
            <input type="email" required autoComplete="email" placeholder="your@email.com" className={inputCls} />
          </Field>
          <Field label="パスワード" hint={`強度: ${strengthLabel}`}>
            <input
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder="8文字以上"
              className={inputCls}
            />
            <div className="mt-2 flex gap-1">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded ${i < strength ? (strength >= 3 ? "bg-[color:var(--success)]" : "bg-[color:var(--cyan)]") : "bg-[color:var(--bg3)]"}`}
                />
              ))}
            </div>
          </Field>
        </section>

        <div className="hair-divider" />

        <section className="space-y-4">
          <div className="font-mono-alt text-[11px] uppercase tracking-widest text-violet">// learning_profile</div>
          <Field label="英語レベル">
            <select required defaultValue="" className={inputCls}>
              <option value="" disabled>選択してください</option>
              <option value="beginner">Beginner(初心者)</option>
              <option value="intermediate">Intermediate(中級)</option>
              <option value="advanced">Advanced(上級)</option>
            </select>
          </Field>
          <Field label="自己紹介" hint={`${bio.length}/300`}>
            <textarea
              maxLength={300}
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="ご自身やお子様について少し教えてください..."
              className={`${inputCls} resize-none`}
            />
          </Field>
          <Field label="好きなゲーム">
            <div className="grid grid-cols-2 gap-3">
              {(["minecraft", "fortnite"] as const).map((g) => {
                const active = game === g;
                return (
                  <button
                    type="button"
                    key={g}
                    onClick={() => setGame(g)}
                    className={`card-hair p-4 text-left transition-all ${active ? "border-[color:var(--cyan)] bg-[color:var(--bg3)]" : ""}`}
                  >
                    <div className="font-mono-alt text-[10px] uppercase tracking-widest text-muted">
                      [{active ? "×" : " "}]
                    </div>
                    <div className="mt-1 font-display text-base capitalize">{g}</div>
                    <div className="mt-1 font-mono-alt text-[11px] text-muted">
                      {g === "minecraft" ? "survival · pvp" : "battle royale"}
                    </div>
                  </button>
                );
              })}
            </div>
          </Field>
        </section>

        <button type="submit" className="btn-primary w-full">アカウント作成</button>
      </form>
    </AuthFrame>
  );
}