import { loadStripe, type Stripe } from "@stripe/stripe-js";
export { CREDIT_PACKAGES, type PackageCode } from "@/lib/pricing";

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