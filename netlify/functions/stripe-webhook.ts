import { Handler } from '@netlify/functions';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_KEY || ''
);

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const sig = event.headers['stripe-signature'];
  if (!sig) {
    return { statusCode: 400, body: 'No signature' };
  }

  try {
    const stripeEvent = stripe.webhooks.constructEvent(
      event.body || '',
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );

    if (stripeEvent.type === 'checkout.session.completed') {
      const session = stripeEvent.data.object as Stripe.Checkout.Session;
      const metadata = session.metadata;

      if (!metadata) {
        throw new Error('No metadata');
      }

      // Créer commande
      const { data: newOrder, error } = await supabase
        .from('orders')
        .insert({
          user_id: metadata.user_id,
          partner_id: metadata.partner_id,
          weight_kg: parseFloat(metadata.weight_kg),
          service_type: metadata.service_type,
          total_amount: parseFloat(metadata.total_amount),
          status: 'pending',
          payment_status: 'paid',
          stripe_session_id: session.id,
        })
        .select()
        .single();

      if (error) throw error;

      // Envoyer email confirmation
      if (newOrder) {
        try {
          await fetch(`${process.env.URL}/.netlify/functions/send-order-confirmation`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: metadata.customer_email,
              orderId: newOrder.id,
              partnerName: metadata.partner_name,
              weightKg: metadata.weight_kg,
              totalAmount: metadata.total_amount,
              serviceType: metadata.service_type
            })
          });
        } catch (emailError) {
          console.error('Erreur email:', emailError);
        }
      }

      console.log('✅ Commande créée:', newOrder.id);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true }),
    };
  } catch (error: any) {
    console.error('Webhook error:', error);
    return {
      statusCode: 400,
      body: `Webhook Error: ${error.message}`,
    };
  }
};
