import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia'
});

interface CheckoutBody {
  orderId: string;
  amount: number;
  partnerStripeAccountId?: string;
  serviceType: string;
  weightKg: number;
}

export async function handler(event: any) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const body: CheckoutBody = JSON.parse(event.body);
    const { orderId, amount, partnerStripeAccountId, serviceType, weightKg } = body;

    if (!orderId || !amount) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }

    // Déterminer le prix unitaire selon le service
    const pricePerKg = serviceType === 'express' ? 5.00 : 3.50;
    const serviceLabel = serviceType === 'express' ? 'Express (24h)' : 'Standard (48-72h)';

    // Créer session Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Pressing Kilolab - ${serviceLabel}`,
              description: `${weightKg} kg de linge - Lavage, séchage et pliage professionnel`,
              images: ['https://kilolab.fr/logo.png'],
            },
            unit_amount: Math.round(amount * 100), // Convertir en centimes
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.URL}/payment-success?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
      cancel_url: `${process.env.URL}/payment-cancel?order_id=${orderId}`,
      customer_email: undefined, // Sera rempli par l'user
      locale: 'fr',
      metadata: {
        orderId,
        partnerStripeAccountId: partnerStripeAccountId || '',
        serviceType,
        weightKg: weightKg.toString(),
        pricePerKg: pricePerKg.toString()
      },
      // Si le pressing a un compte Stripe Connect, split payment
      ...(partnerStripeAccountId && {
        payment_intent_data: {
          application_fee_amount: Math.round(amount * 0.20), // 20% commission Kilolab
          transfer_data: {
            destination: partnerStripeAccountId,
          },
        },
      }),
    });

    console.log('✅ Session Stripe créée:', session.id);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        url: session.url, 
        sessionId: session.id 
      })
    };
  } catch (error: any) {
    console.error('❌ Stripe error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: error.message || 'Erreur lors de la création de la session'
      })
    };
  }
}
