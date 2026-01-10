import { loadStripe, Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
    if (!key) {
      console.error('❌ VITE_STRIPE_PUBLISHABLE_KEY manquant');
      return null;
    }
    stripePromise = loadStripe(key);
  }
  return stripePromise;
};

export const createConnectAccount = async (email: string, businessName: string, userId: string) => {
  const response = await fetch('/api/create-connect-account', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, businessName, userId }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erreur API Stripe Connect');
  }
  
  return await response.json();
};
