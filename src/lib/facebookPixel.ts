// Facebook Pixel Helper - Kilolab
// Pixel ID: 1573268523913279

declare global {
  interface Window {
    fbq?: (action: string, eventName: string, params?: Record<string, any>) => void;
  }
}

export const trackFacebookEvent = (
  eventName: string,
  params?: Record<string, any>
) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, params);
    console.log('📊 Facebook Event:', eventName, params);
  }
};

// 1. ACHAT - À utiliser dans PaymentSuccess.tsx
export const trackPurchase = (orderId: string, amount: number, weight: number) => {
  trackFacebookEvent('Purchase', {
    content_ids: [orderId],
    value: amount,
    currency: 'EUR',
    num_items: 1
  });
};

// 2. INSCRIPTION PARTENAIRE - À utiliser dans BecomePartner.tsx
export const trackPartnerSignup = (partnerName: string) => {
  trackFacebookEvent('Lead', {
    content_name: 'Partner Registration',
    content_category: 'B2B'
  });
};

// 3. DÉBUT COMMANDE - À utiliser dans CreateOrder.tsx
export const trackInitiateCheckout = (weight: number, formula: string, price: number) => {
  trackFacebookEvent('InitiateCheckout', {
    content_name: 'Pressing Order',
    value: price,
    currency: 'EUR'
  });
};

// 4. INSCRIPTION CLIENT - À utiliser dans Signup.tsx
export const trackClientSignup = () => {
  trackFacebookEvent('CompleteRegistration', {
    content_name: 'Client Registration'
  });
};

// 5. FORMULAIRE CONTACT - À utiliser dans Contact.tsx
export const trackContact = () => {
  trackFacebookEvent('Contact', {
    content_name: 'Contact Form'
  });
};
