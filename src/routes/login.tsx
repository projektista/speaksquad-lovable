import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AuthFrame, Field, inputCls } from "@/components/ui/auth-frame";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Entrar — SpeakSquad" },
      { name: "description", content: "Acesse sua conta SpeakSquad." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Login,
});

function Login() {
  const [show, setShow] = useState(false);
  return (
    <AuthFrame
      code="auth_01"
      title="Entrar"
      subtitle="Bem-vindo de volta. Continue sua jornada."
      footer={
        <>
          Não tem conta?{" "}
          <Link to="/signup" className="text-cyan hover:text-magenta">
            Criar conta
          </Link>
        </>
      }
    >
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <Field label="Email">
          <input type="email" required autoComplete="email" placeholder="seu@email.com" className={inputCls} />
        </Field>
        <Field
          label="Senha"
          hint={
            <button type="button" onClick={() => setShow((v) => !v)} className="hover:text-cyan">
              {show ? "ocultar" : "mostrar"}
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
            <input type="checkbox" className="accent-[color:var(--cyan)]" /> lembrar de mim
          </label>
          <a href="#" className="text-cyan hover:text-magenta">esqueci a senha</a>
        </div>
        <button type="submit" className="btn-primary w-full">Entrar</button>
      </form>
    </AuthFrame>
  );
}