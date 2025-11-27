declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

// ID Google Analytics - À remplacer par ton ID
const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';

// ============================================
// INITIALISATION
// ============================================

export function initializeGA(): void {
  // Ajouter le script GA
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  // Initialiser dataLayer
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };

  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: window.location.pathname,
    cookie_flags: 'SameSite=None;Secure',
    anonymize_ip: true // RGPD
  });

  console.log('✅ Google Analytics initialisé');
}

// ============================================
// TRACKING DE PAGES
// ============================================

export function trackPageView(path: string, title?: string): void {
  if (!window.gtag) return;

  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: path,
    page_title: title || document.title
  });
}

// ============================================
// ÉVÉNEMENTS E-COMMERCE
// ============================================

// Voir un pressing
export function trackViewPartner(partner: {
  id: string;
  name: string;
  city: string;
  price?: number;
}): void {
  if (!window.gtag) return;

  window.gtag('event', 'view_item', {
    currency: 'EUR',
    value: partner.price || 0,
    items: [{
      item_id: partner.id,
      item_name: partner.name,
      item_category: 'pressing',
      item_category2: partner.city,
      price: partner.price || 0
    }]
  });
}

// Commencer une commande
export function trackBeginCheckout(order: {
  id: string;
  partnerId: string;
  partnerName: string;
  weight: number;
  serviceType: string;
  total: number;
}): void {
  if (!window.gtag) return;

  window.gtag('event', 'begin_checkout', {
    currency: 'EUR',
    value: order.total,
    items: [{
      item_id: order.partnerId,
      item_name: order.partnerName,
      item_category: 'pressing',
      item_variant: order.serviceType,
      quantity: order.weight,
      price: order.total / order.weight
    }]
  });
}

// Commande confirmée
export function trackPurchase(order: {
  id: string;
  partnerId: string;
  partnerName: string;
  weight: number;
  serviceType: string;
  total: number;
}): void {
  if (!window.gtag) return;

  window.gtag('event', 'purchase', {
    transaction_id: order.id,
    currency: 'EUR',
    value: order.total,
    items: [{
      item_id: order.partnerId,
      item_name: order.partnerName,
      item_category: 'pressing',
      item_variant: order.serviceType,
      quantity: order.weight,
      price: order.total / order.weight
    }]
  });
}

// ============================================
// ÉVÉNEMENTS UTILISATEUR
// ============================================

// Inscription
export function trackSignUp(method: string = 'email'): void {
  if (!window.gtag) return;

  window.gtag('event', 'sign_up', {
    method
  });
}

// Connexion
export function trackLogin(method: string = 'email'): void {
  if (!window.gtag) return;

  window.gtag('event', 'login', {
    method
  });
}

// Inscription partenaire
export function trackPartnerSignup(partner: {
  city: string;
  postalCode: string;
}): void {
  if (!window.gtag) return;

  window.gtag('event', 'generate_lead', {
    currency: 'EUR',
    value: 0,
    event_category: 'partner',
    event_label: partner.city
  });
}

// ============================================
// ÉVÉNEMENTS ENGAGEMENT
// ============================================

// Recherche
export function trackSearch(searchTerm: string, resultsCount: number): void {
  if (!window.gtag) return;

  window.gtag('event', 'search', {
    search_term: searchTerm,
    results_count: resultsCount
  });
}

// Filtre utilisé
export function trackFilter(filterType: string, filterValue: string): void {
  if (!window.gtag) return;

  window.gtag('event', 'filter', {
    filter_type: filterType,
    filter_value: filterValue
  });
}

// Géolocalisation
export function trackGeolocation(success: boolean): void {
  if (!window.gtag) return;

  window.gtag('event', 'geolocation', {
    success,
    event_category: 'engagement'
  });
}

// Contact
export function trackContact(type: 'form' | 'phone' | 'email'): void {
  if (!window.gtag) return;

  window.gtag('event', 'contact', {
    contact_type: type,
    event_category: 'engagement'
  });
}

// Partage
export function trackShare(method: string, contentType: string, itemId: string): void {
  if (!window.gtag) return;

  window.gtag('event', 'share', {
    method,
    content_type: contentType,
    item_id: itemId
  });
}

// Avis laissé
export function trackReview(rating: number, partnerId: string): void {
  if (!window.gtag) return;

  window.gtag('event', 'review', {
    rating,
    partner_id: partnerId,
    event_category: 'engagement'
  });
}

// QR Code scanné/téléchargé
export function trackQRCode(action: 'view' | 'download' | 'scan', orderId: string): void {
  if (!window.gtag) return;

  window.gtag('event', 'qr_code', {
    action,
    order_id: orderId,
    event_category: 'engagement'
  });
}

// Parrainage
export function trackReferral(action: 'share' | 'apply', code: string): void {
  if (!window.gtag) return;

  window.gtag('event', 'referral', {
    action,
    referral_code: code,
    event_category: 'acquisition'
  });
}

// ============================================
// ÉVÉNEMENTS PERSONNALISÉS
// ============================================

export function trackCustomEvent(
  eventName: string, 
  params?: Record<string, any>
): void {
  if (!window.gtag) return;

  window.gtag('event', eventName, params);
}

// ============================================
// DÉFINIR L'UTILISATEUR
// ============================================

export function setUserId(userId: string): void {
  if (!window.gtag) return;

  window.gtag('config', GA_MEASUREMENT_ID, {
    user_id: userId
  });
}

export function setUserProperties(properties: {
  user_type?: 'client' | 'partner' | 'admin';
  city?: string;
  orders_count?: number;
}): void {
  if (!window.gtag) return;

  window.gtag('set', 'user_properties', properties);
}

// ============================================
// CONSENTEMENT RGPD
// ============================================

export function updateConsent(granted: boolean): void {
  if (!window.gtag) return;

  window.gtag('consent', 'update', {
    analytics_storage: granted ? 'granted' : 'denied',
    ad_storage: granted ? 'granted' : 'denied'
  });
}

// Initialisation par défaut (consentement refusé)
export function initConsentMode(): void {
  if (!window.gtag) return;

  window.gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    wait_for_update: 500
  });
}

// ============================================
// EXPORT PAR DÉFAUT
// ============================================

export default {
  initializeGA,
  trackPageView,
  trackViewPartner,
  trackBeginCheckout,
  trackPurchase,
  trackSignUp,
  trackLogin,
  trackPartnerSignup,
  trackSearch,
  trackFilter,
  trackGeolocation,
  trackContact,
  trackShare,
  trackReview,
  trackQRCode,
  trackReferral,
  trackCustomEvent,
  setUserId,
  setUserProperties,
  updateConsent,
  initConsentMode
};
