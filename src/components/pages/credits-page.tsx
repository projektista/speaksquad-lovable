import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/app-shell";
import { Reveal } from "@/components/fx/reveal";
import { PaymentTestModeBanner } from "@/components/PaymentTestModeBanner";
import { StripeEmbeddedCheckout } from "@/components/StripeEmbeddedCheckout";
import { CREDIT_PACKAGES, type PackageCode } from "@/lib/stripe";
import { getMyOverview } from "@/lib/booking.functions";
import type { Lang } from "@/lib/i18n";

const copy = {
  pt: {
    title: "Créditos",
    subtitle: "Compre pacotes de aulas",
    current: "créditos_disponíveis",
    buy: "Comprar",
    expires: "expira em",
    days: "dias",
    credit: "crédito",
    credits: "créditos",
    close: "Fechar",
    packages: {
      single: { name: "Aula avulsa", desc: "1 crédito, use quando quiser" },
      pack5: { name: "Pacote 5 aulas", desc: "Economize e mantenha o ritmo" },
      pack10: { name: "Pacote 10 aulas", desc: "Melhor custo por aula" },
    },
  },
  jp: {
    title: "クレジット",
    subtitle: "レッスンパックを購入",
    current: "残りクレジット",
    buy: "購入",
    expires: "有効期限",
    days: "日",
    credit: "クレジット",
    credits: "クレジット",
    close: "閉じる",
    packages: {
      single: { name: "単発レッスン", desc: "1クレジット" },
      pack5: { name: "5回パック", desc: "お得な5レッスン" },
      pack10: { name: "10回パック", desc: "最もお得な10レッスン" },
    },
  },
} as const;

function formatJpy(n: number, lang: Lang) {
  return new Intl.NumberFormat(lang === "jp" ? "ja-JP" : "pt-BR", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(n);
}

export function CreditsPage({ lang }: { lang: Lang }) {
  const t = copy[lang];
  const { data } = useQuery({
    queryKey: ["dashboard-overview"],
    queryFn: () => getMyOverview(),
  });
  const [active, setActive] = useState<PackageCode | null>(null);

  const returnUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}${lang === "jp" ? "/jp" : ""}/checkout/return?session_id={CHECKOUT_SESSION_ID}`
      : "";

  return (
    <>
      <PaymentTestModeBanner />
      <AppShell lang={lang} title={t.title} subtitle={t.subtitle} credits={data?.available ?? 0}>
        <div className="grid gap-4 md:grid-cols-3">
          {(Object.keys(CREDIT_PACKAGES) as PackageCode[]).map((code, i) => {
            const pkg = CREDIT_PACKAGES[code];
            const info = t.packages[code];
            return (
              <Reveal key={code} delay={i * 80}>
                <div className="card-hair flex h-full flex-col p-5">
                  <div className="section-label">{`0${i + 1}`}</div>
                  <h3 className="mt-2 font-display text-xl">{info.name}</h3>
                  <p className="mt-1 text-sm text-muted">{info.desc}</p>
                  <div className="mt-4 font-display text-3xl text-cyan">
                    {formatJpy(pkg.amountJpy, lang)}
                  </div>
                  <div className="mt-1 font-mono-alt text-xs text-muted">
                    {pkg.credits} {pkg.credits === 1 ? t.credit : t.credits} · {t.expires}{" "}
                    {pkg.expiryDays} {t.days}
                  </div>
                  <button
                    className="btn-primary mt-6 w-full"
                    onClick={() => setActive(code)}
                  >
                    {t.buy}
                  </button>
                </div>
              </Reveal>
            );
          })}
        </div>

        {active && (
          <div
            className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4"
            onClick={() => setActive(null)}
          >
            <div
              className="card-hair mt-8 w-full max-w-2xl bg-background p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="font-display text-lg">
                  {t.packages[active].name}
                </div>
                <button
                  className="btn-outline !py-1 !px-3 text-xs"
                  onClick={() => setActive(null)}
                >
                  {t.close}
                </button>
              </div>
              <StripeEmbeddedCheckout packageCode={active} returnUrl={returnUrl} />
            </div>
          </div>
        )}
      </AppShell>
    </>
  );
}