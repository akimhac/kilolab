import Stripe from 'stripe';
import { Handler } from '@netlify/functions';

// Initialiser Stripe avec la clé secrète
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

interface CheckoutBody {
  serviceType: 'standard' | 'express' | 'ultra';
  weight: number;
  orderId: string;
}

export const handler: Handler = async (event) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Handle OPTIONS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Parse request body
    if (!event.body) {
      throw new Error('Missing request body');
    }

    const { serviceType, weight, orderId } = JSON.parse(event.body) as CheckoutBody;

    // Validation
    if (!serviceType || !weight || !orderId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    // Prix par kg selon la formule
    const pricePerKg = {
      standard: 5.00,
      express: 10.00,
      ultra: 15.00,
    };

    const unitAmount = Math.round(pricePerKg[serviceType] * weight * 100); // en centimes

    // Labels des formules
    const serviceLabels = {
      standard: 'Standard (72-96h)',
      express: 'Express (24h)',
      ultra: 'Ultra Express (6h)',
    };

    // Créer la session Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Kilolab - ${serviceLabels[serviceType]}`,
              description: `${weight} kg de linge`,
              images: ['https://i.imgur.com/EHyR2nP.png'], // Logo KiloLab (optionnel)
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      // URLs de redirection
      success_url: `${process.env.URL || 'http://localhost:5173'}/payment-success?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
      cancel_url: `${process.env.URL || 'http://localhost:5173'}/payment-cancelled?order_id=${orderId}`,
      // Metadata pour traçabilité
      metadata: {
        orderId,
        serviceType,
        weight: weight.toString(),
      },
      // Collecter l'adresse email (optionnel si déjà connecté)
      customer_email: undefined, // On pourrait passer l'email du user ici
      // Mode de facturation
      billing_address_collection: 'auto',
    });

    // Retourner l'URL de checkout
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        url: session.url,
        sessionId: session.id,
      }),
    };
  } catch (error: any) {
    console.error('Stripe Checkout error:', error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to create checkout session',
        message: error.message,
      }),
    };
  }
};
