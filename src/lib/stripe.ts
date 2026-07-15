import { loadStripe, type Stripe } from "@stripe/stripe-js";

export type StripeEnv = "sandbox" | "live";

const clientToken = import.meta.env.VITE_PAYMENTS_CLIENT_TOKEN as string | undefined;

function paymentsEnvironment(): StripeEnv {
  if (clientToken?.startsWith("pk_test_")) return "sandbox";
  if (clientToken?.startsWith("pk_live_")) return "live";
  throw new Error(
    "Stripe payments are not configured for this build. Complete Stripe go-live in your Lovable project to enable production checkout.",
  );
}

let stripePromise: Promise<Stripe | null> | null = null;

export function getStripe(): Promise<Stripe | null> {
  if (!stripePromise) {
    paymentsEnvironment();
    stripePromise = loadStripe(clientToken as string);
  }
  return stripePromise;
}

export function getStripeEnvironment(): StripeEnv {
  return paymentsEnvironment();
}

export const CREDIT_PACKAGES = {
  single: { priceId: "credit_single", credits: 1, expiryDays: 30, amountJpy: 2800 },
  pack5: { priceId: "credit_pack5", credits: 5, expiryDays: 45, amountJpy: 13000 },
  pack10: { priceId: "credit_pack10", credits: 10, expiryDays: 90, amountJpy: 24000 },
} as const;

export type PackageCode = keyof typeof CREDIT_PACKAGES;