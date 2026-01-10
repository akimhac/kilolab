import { loadStripe, Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
    
    if (!key) {
      console.error('❌ VITE_STRIPE_PUBLISHABLE_KEY manquant dans .env');
      return null;
    }
    
    stripePromise = loadStripe(key);
  }
  return stripePromise;
};

// Fonction pour créer une session Checkout
export const createCheckoutSession = async (items: any[], partnerId?: string) => {
  try {
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items, partnerId }),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la création de la session');
    }

    const session = await response.json();
    return session;
  } catch (error) {
    console.error('Erreur Checkout:', error);
    throw error;
  }
};

// Fonction pour créer un compte Stripe Connect
export const createConnectAccount = async (email: string, businessName: string) => {
  try {
    const response = await fetch('/api/stripe/create-connect-account', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, businessName }),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la création du compte Connect');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur Connect:', error);
    throw error;
  }
};
