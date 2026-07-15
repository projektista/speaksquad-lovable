import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { type StripeEnv, verifyWebhook } from "@/lib/stripe.server";

let _supabase: ReturnType<typeof createClient> | null = null;
function getSupabase() {
  if (!_supabase) {
    _supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );
  }
  return _supabase;
}

async function handleCheckoutCompleted(session: any) {
  const userId = session.metadata?.userId;
  const packageCode = session.metadata?.packageCode;
  const credits = Number(session.metadata?.credits);
  const expiryDays = Number(session.metadata?.expiryDays);
  const amountJpy = Number(session.metadata?.amountJpy);

  if (!userId || !packageCode || !credits || !expiryDays) {
    console.error("Missing metadata in checkout session", session.id);
    return;
  }
  if (session.payment_status !== "paid") {
    console.log("Skipping unpaid session", session.id, session.payment_status);
    return;
  }

  const supabase = getSupabase();

  const { data: existing } = await supabase
    .from("credit_purchases")
    .select("id, status")
    .eq("stripe_session_id", session.id)
    .maybeSingle();

  if (existing && (existing as any).status === "paid") {
    console.log("Purchase already processed", session.id);
    return;
  }

  const paidAt = new Date().toISOString();
  const expiresAt = new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000).toISOString();

  let purchaseId: string;
  if (existing) {
    purchaseId = (existing as any).id;
    await supabase
      .from("credit_purchases")
      .update({
        status: "paid",
        paid_at: paidAt,
        stripe_payment_intent: session.payment_intent ?? null,
      })
      .eq("id", purchaseId);
  } else {
    const { data: created, error } = await supabase
      .from("credit_purchases")
      .insert({
        user_id: userId,
        package_code: packageCode,
        credits,
        amount_jpy: amountJpy,
        expiry_days: expiryDays,
        status: "paid",
        stripe_session_id: session.id,
        stripe_payment_intent: session.payment_intent ?? null,
        paid_at: paidAt,
      })
      .select("id")
      .single();
    if (error || !created) {
      console.error("Failed to insert purchase", error);
      return;
    }
    purchaseId = (created as any).id;
  }

  const lots = Array.from({ length: credits }, () => ({
    user_id: userId,
    purchase_id: purchaseId,
    expires_at: expiresAt,
    source: "purchase",
  }));
  const { error: lotErr } = await supabase.from("credit_lots").insert(lots);
  if (lotErr) {
    console.error("Failed to insert lots", lotErr);
    return;
  }

  await supabase.from("credit_transactions").insert({
    user_id: userId,
    type: "purchase",
    amount: credits,
    note: `Stripe ${session.id}`,
  });
}

export const Route = createFileRoute("/api/public/payments/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const rawEnv = new URL(request.url).searchParams.get("env");
        if (rawEnv !== "sandbox" && rawEnv !== "live") {
          console.error("Webhook received with invalid env param:", rawEnv);
          return Response.json({ received: true, ignored: "invalid env" });
        }
        const env: StripeEnv = rawEnv;
        try {
          const event = await verifyWebhook(request, env);
          switch (event.type) {
            case "checkout.session.completed":
            case "checkout.session.async_payment_succeeded":
              await handleCheckoutCompleted(event.data.object);
              break;
            default:
              console.log("Unhandled event:", event.type);
          }
          return Response.json({ received: true });
        } catch (e) {
          console.error("Webhook error:", e);
          return new Response("Webhook error", { status: 400 });
        }
      },
    },
  },
});