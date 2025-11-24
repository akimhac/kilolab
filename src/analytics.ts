// Tracker les événements importants
export const trackEvent = (eventName: string, data?: Record<string, any>) => {
  // Google Tag Manager
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: eventName,
      ...data
    });
  }

  // Console en dev
  if (import.meta.env.DEV) {
    console.log('📊 Event tracked:', eventName, data);
  }
};

// Événements spécifiques
export const analytics = {
  // Page vue
  pageView: (path: string) => {
    trackEvent('page_view', { 
      page_path: path,
      page_title: document.title 
    });
  },

  // Commande créée
  orderCreated: (orderId: string, amount: number, serviceType: string) => {
    trackEvent('order_created', {
      order_id: orderId,
      value: amount,
      currency: 'EUR',
      service_type: serviceType
    });
  },

  // Paiement réussi (conversion principale)
  paymentSuccess: (orderId: string, amount: number) => {
    trackEvent('purchase', {
      transaction_id: orderId,
      value: amount,
      currency: 'EUR',
      affiliation: 'Kilolab'
    });
  },

  // Pressing vu
  partnerViewed: (partnerId: string, partnerName: string) => {
    trackEvent('partner_viewed', {
      partner_id: partnerId,
      partner_name: partnerName
    });
  },

  // Inscription pressing
  partnerSignup: (partnerEmail: string) => {
    trackEvent('partner_signup', {
      partner_email: partnerEmail,
      user_type: 'partner'
    });
  },

  // CTA cliqué
  ctaClicked: (location: string, ctaText: string) => {
    trackEvent('cta_clicked', {
      location,
      cta_text: ctaText
    });
  },

  // Inscription client
  userSignup: (userId: string, method: string) => {
    trackEvent('sign_up', {
      method,
      user_id: userId
    });
  },

  // Connexion client
  userLogin: (userId: string, method: string) => {
    trackEvent('login', {
      method,
      user_id: userId
    });
  }
};

// Déclaration TypeScript pour window.dataLayer
declare global {
  interface Window {
    dataLayer: any[];
  }
}
