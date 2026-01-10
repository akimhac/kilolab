import { Handler } from '@netlify/functions';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

export const handler: Handler = async (event) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { email, businessName } = JSON.parse(event.body || '{}');

    if (!email || !businessName) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Email et businessName requis' }),
      };
    }

    // Créer le compte Stripe Connect
    const account = await stripe.accounts.create({
      type: 'express',
      country: 'FR',
      email: email,
      business_type: 'company',
      business_profile: {
        name: businessName,
      },
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });

    // Créer le lien d'onboarding
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${process.env.URL}/connect-stripe?refresh=true`,
      return_url: `${process.env.URL}/partner-dashboard?stripe_connected=true`,
      type: 'account_onboarding',
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        accountId: account.id,
        url: accountLink.url,
      }),
    };
  } catch (error: any) {
    console.error('Erreur Stripe Connect:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
