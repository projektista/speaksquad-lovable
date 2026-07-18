import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  type StripeEnv,
  createStripeClient,
  getStripeErrorMessage,
} from "@/lib/stripe.server";

const PACKAGES: Record<string, { priceId: string; credits: number; expiryDays: number; amountJpy: number }> = {
  single: { priceId: "credit_single", credits: 1, expiryDays: 30, amountJpy: 2800 },
  pack5: { priceId: "credit_pack5", credits: 5, expiryDays: 45, amountJpy: 13000 },
  pack10: { priceId: "credit_pack10", credits: 10, expiryDays: 90, amountJpy: 24000 },
};

type CheckoutResult = { clientSecret: string } | { error: string };

async function resolveOrCreateCustomer(
  stripe: ReturnType<typeof createStripeClient>,
  options: { email?: string; userId: string },
): Promise<string> {
  if (!/^[a-zA-Z0-9_-]+$/.test(options.userId)) throw new Error("Invalid userId");

  const found = await stripe.customers.search({
    query: `metadata['userId']:'${options.userId}'`,
    limit: 1,
  });
  if (found.data.length) return found.data[0].id;

  if (options.email) {
    const existing = await stripe.customers.list({ email: options.email, limit: 1 });
    if (existing.data.length) {
      const customer = existing.data[0];
      if (customer.metadata?.userId !== options.userId) {
        await stripe.customers.update(customer.id, {
          metadata: { ...customer.metadata, userId: options.userId },
        });
      }
      return customer.id;
    }
  }

  const created = await stripe.customers.create({
    ...(options.email && { email: options.email }),
    metadata: { userId: options.userId },
  });
  return created.id;
}

export const createCheckoutSession = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: {
    packageCode: "single" | "pack5" | "pack10";
    returnUrl: string;
    environment?: StripeEnv;
  }) => {
    if (!PACKAGES[data.packageCode]) throw new Error("Invalid package");
    return data;
  })
  .handler(async ({ data, context }): Promise<CheckoutResult> => {
    try {
      const stripe = createStripeClient(data.environment);
      const pkg = PACKAGES[data.packageCode];

      const prices = await stripe.prices.list({ lookup_keys: [pkg.priceId] });
      if (!prices.data.length) throw new Error(`Price not found: ${pkg.priceId}`);
      const stripePrice = prices.data[0];

      const { userId, supabase } = context;
      const { data: userData } = await supabase.auth.getUser();
      const email = userData?.user?.email ?? undefined;

      const customerId = await resolveOrCreateCustomer(stripe, { email, userId });

      const productId = typeof stripePrice.product === "string"
        ? stripePrice.product
        : stripePrice.product.id;
      const product = await stripe.products.retrieve(productId);

      const session = await stripe.checkout.sessions.create({
        line_items: [{ price: stripePrice.id, quantity: 1 }],
        mode: "payment",
        ui_mode: "embedded_page",
        return_url: data.returnUrl,
        customer: customerId,
        payment_intent_data: { description: product.name },
        metadata: {
          userId,
          packageCode: data.packageCode,
          credits: String(pkg.credits),
          expiryDays: String(pkg.expiryDays),
          amountJpy: String(pkg.amountJpy),
        },
      });

      return { clientSecret: session.client_secret ?? "" };
    } catch (error) {
      return { error: getStripeErrorMessage(error) };
    }
  });