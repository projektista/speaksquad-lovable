import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AuthFrame, Field, inputCls } from "@/components/ui/auth-frame";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Criar conta — SpeakSquad" },
      {
        name: "description",
        content: "Registre-se para começar sua primeira aula gratuita de inglês via games.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Signup,
});

function Signup() {
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

  return (
    <AuthFrame
      code="auth_02"
      title="Criar conta"
      subtitle="Primeira aula grátis. Sem cartão. Sem pressão."
      footer={
        <>
          Já tem conta?{" "}
          <Link to="/login" className="text-cyan hover:text-magenta">Entrar</Link>
        </>
      }
    >
      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        <section className="space-y-4">
          <div className="font-mono-alt text-[11px] uppercase tracking-widest text-violet">// dados_da_conta</div>
          <Field label="Nome">
            <input type="text" required autoComplete="name" placeholder="Seu nome" className={inputCls} />
          </Field>
          <Field label="Email">
            <input type="email" required autoComplete="email" placeholder="seu@email.com" className={inputCls} />
          </Field>
          <Field label="Senha" hint={`força: ${["fraca", "ok", "boa", "forte", "excelente"][strength] ?? "fraca"}`}>
            <input
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder="Mínimo 8 caracteres"
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
          <div className="font-mono-alt text-[11px] uppercase tracking-widest text-violet">// perfil_de_aprendizado</div>
          <Field label="Nível de inglês">
            <select required defaultValue="" className={inputCls}>
              <option value="" disabled>Selecione</option>
              <option value="beginner">Beginner (começo do zero)</option>
              <option value="intermediate">Intermediate (entendo alguma coisa)</option>
              <option value="advanced">Advanced (quero fluência)</option>
            </select>
          </Field>
          <Field label="Breve apresentação" hint={`${bio.length}/300`}>
            <textarea
              maxLength={300}
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Conte um pouco sobre você ou seu filho..."
              className={`${inputCls} resize-none`}
            />
          </Field>
          <Field label="Jogo preferido">
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

        <button type="submit" className="btn-primary w-full">Criar conta</button>
      </form>
    </AuthFrame>
  );
}