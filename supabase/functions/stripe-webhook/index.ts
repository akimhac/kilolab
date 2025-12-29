import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2024-11-20.acacia",
  httpClient: Stripe.createFetchHttpClient(),
});

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseKey);

serve(async (req) => {
  const signature = req.headers.get("stripe-signature");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

  if (!signature || !webhookSecret) {
    return new Response("Webhook signature missing", { status: 400 });
  }

  try {
    const body = await req.text();
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    console.log("📧 Webhook reçu:", event.type);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        
        console.log("✅ Paiement confirmé:", session.id);
        console.log("Order ID:", session.metadata?.order_id);

        // Mettre à jour la commande
        if (session.metadata?.order_id) {
          const { error } = await supabase
            .from("orders")
            .update({
              payment_status: "paid",
              status: "confirmed",
              stripe_session_id: session.id,
              updated_at: new Date().toISOString(),
            })
            .eq("id", session.metadata.order_id);

          if (error) {
            console.error("❌ Erreur update commande:", error);
            throw error;
          }

          console.log("✅ Commande mise à jour:", session.metadata.order_id);
        }
        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;
        
        console.log("⏰ Session expirée:", session.id);

        if (session.metadata?.order_id) {
          await supabase
            .from("orders")
            .update({
              payment_status: "failed",
              status: "cancelled",
            })
            .eq("id", session.metadata.order_id);
        }
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        
        console.log("❌ Paiement échoué:", paymentIntent.id);
        break;
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err: any) {
    console.error("❌ Webhook error:", err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }
});
