import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/app-shell";
import { getMyOverview } from "@/lib/booking.functions";
import type { Lang } from "@/lib/i18n";

const copy = {
  pt: {
    title: "Pagamento",
    confirmed: "PAGAMENTO CONFIRMADO",
    thanks: "Obrigado pela confiança na SpeakSquad.",
    balanceLead: "Você agora tem:",
    credits: "créditos",
    support:
      "Seus créditos já estão disponíveis. É só escolher o melhor horário e começar a próxima aula.",
    receipt: "O recibo foi enviado para o seu e-mail.",
    cta: "Agendar aula",
    notFound: "Sessão não encontrada.",
    schedule: "/ptbr/schedule",
  },
  jp: {
    title: "お支払い",
    confirmed: "お支払い完了",
    thanks: "SpeakSquad をご利用いただきありがとうございます。",
    balanceLead: "現在のクレジット:",
    credits: "クレジット",
    support: "クレジットはすでにご利用いただけます。ご希望の時間を選んで次のレッスンを始めましょう。",
    receipt: "領収書はメールでお送りしました。",
    cta: "予約する",
    notFound: "セッションが見つかりません。",
    schedule: "/schedule",
  },
} as const;

export function CheckoutReturnPage({
  lang,
  sessionId,
}: {
  lang: Lang;
  sessionId?: string;
}) {
  const t = copy[lang];
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard-overview"],
    queryFn: () => getMyOverview(),
    enabled: Boolean(sessionId),
  });

  return (
    <AppShell lang={lang} title={t.title} credits={data?.available ?? 0}>
      <div className="card-hair p-6 text-center">
        {sessionId ? (
          <>
            <span className="badge-pulse">{t.confirmed}</span>
            <p className="mt-4 font-display text-xl">{t.thanks}</p>

            <div className="mt-8">
              <div className="font-mono-alt text-xs text-muted">{t.balanceLead}</div>
              <div className="mt-2 flex items-baseline justify-center gap-2">
                <span className="font-display text-6xl text-cyan">
                  {isLoading ? "…" : (data?.available ?? 0)}
                </span>
                <span className="font-mono-alt text-sm text-muted">{t.credits}</span>
              </div>
            </div>

            <p className="mx-auto mt-8 max-w-md text-sm text-muted">{t.support}</p>
            <p className="mt-2 text-xs text-muted">{t.receipt}</p>

            <div className="mt-8 flex justify-center">
              <Link to={t.schedule} className="btn-primary">
                {t.cta}
              </Link>
            </div>
          </>
        ) : (
          <p className="text-sm text-muted">{t.notFound}</p>
        )}
      </div>
    </AppShell>
  );
}
