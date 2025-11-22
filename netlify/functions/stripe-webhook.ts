import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia'
});

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY! // Vous devez ajouter cette clé
);

export async function handler(event: any) {
  const sig = event.headers['stripe-signature'];

  let stripeEvent: Stripe.Event;

  try {
    stripeEvent = stripe.webhooks.constructEvent(
      event.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('⚠️ Webhook signature verification failed:', err.message);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Webhook signature verification failed' })
    };
  }

  console.log('📥 Webhook reçu:', stripeEvent.type);

  try {
    switch (stripeEvent.type) {
      case 'checkout.session.completed':
        const session = stripeEvent.data.object as Stripe.Checkout.Session;
        const orderId = session.metadata?.orderId;

        if (orderId) {
          // Mettre à jour le statut de la commande
          const { error } = await supabase
            .from('orders')
            .update({
              status: 'confirmed',
              payment_status: 'paid',
              stripe_session_id: session.id,
              stripe_payment_intent_id: session.payment_intent as string
            })
            .eq('id', orderId);

          if (error) {
            console.error('❌ Erreur Supabase:', error);
          } else {
            console.log(`✅ Commande ${orderId} marquée comme payée`);
          }

          // TODO: Envoyer email confirmation au client
          // TODO: Notifier le pressing
        }
        break;

      case 'payment_intent.succeeded':
        console.log('💰 Paiement réussi');
        const paymentIntent = stripeEvent.data.object as Stripe.PaymentIntent;
        console.log('Payment Intent ID:', paymentIntent.id);
        break;

      case 'payment_intent.payment_failed':
        console.log('❌ Paiement échoué');
        const failedIntent = stripeEvent.data.object as Stripe.PaymentIntent;
        console.log('Failed Payment Intent ID:', failedIntent.id);
        
        // Marquer la commande comme échec
        if (failedIntent.metadata?.orderId) {
          await supabase
            .from('orders')
            .update({ 
              payment_status: 'failed',
              status: 'cancelled'
            })
            .eq('id', failedIntent.metadata.orderId);
        }
        break;

      case 'charge.succeeded':
        console.log('💳 Charge réussie');
        break;

      default:
        console.log(`Unhandled event type: ${stripeEvent.type}`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true })
    };
  } catch (error: any) {
    console.error('❌ Erreur traitement webhook:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
}
