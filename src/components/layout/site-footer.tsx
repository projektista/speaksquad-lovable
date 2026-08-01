import { Link } from "@tanstack/react-router";

export function SiteFooter({ lang = "pt" }: { lang?: "pt" | "jp" }) {
  const jp = lang === "jp";
  const privacyTo = jp ? "/privacy" : "/ptbr/privacy";
  const termsTo = jp ? "/terms" : "/ptbr/terms";
  const contactTo = jp ? "/contact" : "/ptbr/contact";
  return (
    <footer className="border-t border-hair bg-bg2/60">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-5 py-8 text-center font-mono-alt text-xs text-muted">
        <p>
          © {new Date().getFullYear()} SpeakSquad ·{" "}
          <Link className="hover:text-cyan" to={privacyTo}>
            {jp ? "プライバシー" : "Privacidade"}
          </Link> ·{" "}
          <Link className="hover:text-cyan" to={termsTo}>
            {jp ? "利用規約" : "Termos"}
          </Link> ·{" "}
          <Link className="hover:text-cyan" to={contactTo}>
            {jp ? "お問い合わせ" : "Contato"}
          </Link>
        </p>
        <p className="text-cyan/70">// LEVEL_UP_YOUR_ENGLISH</p>
      </div>
    </footer>
  );
}