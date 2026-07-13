export function SiteFooter({ lang = "pt" }: { lang?: "pt" | "jp" }) {
  const jp = lang === "jp";
  return (
    <footer className="border-t border-hair bg-bg2/60">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-5 py-8 text-center font-mono-alt text-xs text-muted">
        <p>
          © {new Date().getFullYear()} SpeakSquad ·{" "}
          <a className="hover:text-cyan" href="#">{jp ? "プライバシー" : "Privacidade"}</a> ·{" "}
          <a className="hover:text-cyan" href="#">{jp ? "利用規約" : "Termos"}</a> ·{" "}
          <a className="hover:text-cyan" href="mailto:hugo@speaksquad.jp">{jp ? "お問い合わせ" : "Contato"}</a>
        </p>
        <p className="text-cyan/70">// LEVEL_UP_YOUR_ENGLISH</p>
      </div>
    </footer>
  );
}