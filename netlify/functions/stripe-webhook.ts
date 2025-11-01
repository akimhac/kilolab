import Stripe from 'stripe';
import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

// Initialiser Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

// Initialiser Supabase (côté serveur avec service_role pour bypass RLS)
const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // Clé admin pour écrire dans la DB
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export const handler: Handler = async (event) => {
  // Seuls les POST sont acceptés
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      throw new Error('Missing STRIPE_WEBHOOK_SECRET environment variable');
    }

    // Vérifier la signature du webhook
    const signature = event.headers['stripe-signature'];

    if (!signature || !event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing signature or body' }),
      };
    }

    // Construire et vérifier l'événement
    const stripeEvent = stripe.webhooks.constructEvent(
      event.body,
      signature,
      webhookSecret
    );

    console.log(`✅ Stripe event received: ${stripeEvent.type}`);

    // Gérer les différents types d'événements
    switch (stripeEvent.type) {
      case 'checkout.session.completed': {
        const session = stripeEvent.data.object as Stripe.Checkout.Session;

        // Récupérer l'orderId depuis les metadata
        const orderId = session.metadata?.orderId;

        if (!orderId) {
          console.error('⚠️  No orderId in session metadata');
          break;
        }

        // Mettre à jour le statut de la commande dans Supabase
        const { error } = await supabase
          .from('orders')
          .update({
            status: 'paid',
            stripe_session_id: session.id,
            stripe_payment_intent: session.payment_intent as string,
            updated_at: new Date().toISOString(),
          })
          .eq('id', orderId);

        if (error) {
          console.error('❌ Error updating order:', error);
          throw error;
        }

        console.log(`✅ Order ${orderId} marked as paid`);
        break;
      }

      case 'checkout.session.expired': {
        const session = stripeEvent.data.object as Stripe.Checkout.Session;
        const orderId = session.metadata?.orderId;

        if (!orderId) break;

        // Marquer la commande comme expirée/annulée
        const { error } = await supabase
          .from('orders')
          .update({
            status: 'cancelled',
            updated_at: new Date().toISOString(),
          })
          .eq('id', orderId);

        if (error) {
          console.error('❌ Error updating order:', error);
        }

        console.log(`⏰ Order ${orderId} marked as cancelled (session expired)`);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = stripeEvent.data.object as Stripe.PaymentIntent;

        // Vous pouvez gérer les échecs de paiement ici
        console.log(`❌ Payment failed for intent ${paymentIntent.id}`);
        break;
      }

      default:
        console.log(`⚠️  Unhandled event type: ${stripeEvent.type}`);
    }

    // Toujours retourner 200 pour confirmer la réception
    return {
      statusCode: 200,
      body: JSON.stringify({ received: true }),
    };
  } catch (error: any) {
    console.error('❌ Webhook error:', error.message);

    return {
      statusCode: 400,
      body: JSON.stringify({
        error: 'Webhook error',
        message: error.message,
      }),
    };
  }
};
