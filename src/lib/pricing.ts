import type { Lang } from "@/lib/i18n";

export const CREDIT_PACKAGES = {
  single: {
    code: "single",
    lookupKey: "credit_single",
    credits: 1,
    amountJpy: 2800,
    expiryDays: 20,
  },
  pack5: {
    code: "pack5",
    lookupKey: "credit_pack5",
    credits: 5,
    amountJpy: 13000,
    expiryDays: 45,
  },
  pack10: {
    code: "pack10",
    lookupKey: "credit_pack10",
    credits: 10,
    amountJpy: 24000,
    expiryDays: 90,
  },
} as const;

export type PackageCode = keyof typeof CREDIT_PACKAGES;

export function formatJpyPrice(amount: number): string {
  return `¥${amount.toLocaleString("pt-BR")}`;
}

export function formatPricingPer(
  amountJpy: number,
  credits: number,
  lang: Lang,
): string {
  if (credits === 1) return lang === "jp" ? "1レッスン" : "por aula";
  const per = Math.round(amountJpy / credits);
  const price = formatJpyPrice(per);
  return lang === "jp" ? `1回あたり ${price}` : `${price} por aula`;
}

export function formatExpiryDays(days: number, lang: Lang): string {
  return lang === "jp" ? `有効期限 ${days}日` : `Expira em ${days} dias`;
}

export function formatSavePercent(
  amountJpy: number,
  credits: number,
  lang: Lang,
): string {
  const singlePerLesson =
    CREDIT_PACKAGES.single.amountJpy / CREDIT_PACKAGES.single.credits;
  const perLesson = amountJpy / credits;
  const percent = Math.round(
    ((singlePerLesson - perLesson) / singlePerLesson) * 100,
  );
  return lang === "jp" ? `約${percent}%オフ` : `economize ~${percent}%`;
}

export function formatExpiryFaq(lang: Lang): string {
  if (lang === "jp") {
    return `はい。単発は${CREDIT_PACKAGES.single.expiryDays}日、5回パックは${CREDIT_PACKAGES.pack5.expiryDays}日、10回パックは${CREDIT_PACKAGES.pack10.expiryDays}日で有効期限が切れます。継続利用を促すための設定です。`;
  }
  return `Sim. Aula avulsa expira em ${CREDIT_PACKAGES.single.expiryDays} dias, pacote de 5 em ${CREDIT_PACKAGES.pack5.expiryDays} dias e pacote de 10 em ${CREDIT_PACKAGES.pack10.expiryDays} dias — para incentivar o uso frequente.`;
}
