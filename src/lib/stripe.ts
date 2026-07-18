import { loadStripe, type Stripe } from "@stripe/stripe-js";

export type StripeEnv = "sandbox" | "live";

const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string | undefined;

function assertKey(): string {
  if (!publishableKey) {
    throw new Error("VITE_STRIPE_PUBLISHABLE_KEY is not configured.");
  }
  return publishableKey;
}

let stripePromise: Promise<Stripe | null> | null = null;

export function getStripe(): Promise<Stripe | null> {
  if (!stripePromise) {
    stripePromise = loadStripe(assertKey());
  }
  return stripePromise;
}

export function getStripeEnvironment(): StripeEnv {
  const key = assertKey();
  if (key.startsWith("pk_test_")) return "sandbox";
  return "live";
}

export const CREDIT_PACKAGES = {
  single: { priceId: "credit_single", credits: 1, expiryDays: 30, amountJpy: 2800 },
  pack5: { priceId: "credit_pack5", credits: 5, expiryDays: 45, amountJpy: 13000 },
  pack10: { priceId: "credit_pack10", credits: 10, expiryDays: 90, amountJpy: 24000 },
} as const;

export type PackageCode = keyof typeof CREDIT_PACKAGES;