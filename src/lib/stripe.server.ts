import Stripe from 'stripe';

const getEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`${key} is not configured`);
  return value;
};

// Retained for backwards compatibility with the webhook `?env=` query param
// and existing server-fn inputs. All values resolve to the same account —
// use separate Stripe accounts (test vs live keys) per deploy environment.
export type StripeEnv = 'sandbox' | 'live';

let _stripe: Stripe | null = null;
export function createStripeClient(_env?: StripeEnv): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(getEnv('STRIPE_SECRET_KEY'), {
      apiVersion: '2026-03-25.dahlia',
    });
  }
  return _stripe;
}

export function getStripeErrorMessage(error: unknown): string {
  if (error && typeof error === 'object') {
    const stripeError = error as {
      message?: string;
      type?: string;
      code?: string;
      raw?: { message?: string; type?: string; code?: string };
    };
    const message = stripeError.raw?.message ?? stripeError.message;
    if (message) return message;
  }
  return 'Stripe request failed';
}

export async function verifyWebhook(
  req: Request,
  _env?: StripeEnv,
): Promise<{ type: string; data: { object: any } }> {
  const signature = req.headers.get('stripe-signature');
  const body = await req.text();
  if (!signature || !body) throw new Error('Missing signature or body');
  const stripe = createStripeClient();
  const event = await stripe.webhooks.constructEventAsync(
    body,
    signature,
    getEnv('STRIPE_WEBHOOK_SECRET'),
  );
  return event as unknown as { type: string; data: { object: any } };
}