// Analytics & Tracking Hook
// Centralise tous les events Meta Pixel + GA4

declare global {
  interface Window {
    fbq: (...args: unknown[]) => void;
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

type EventName = 
  | 'signup'
  | 'login'
  | 'order_started'
  | 'order_completed'
  | 'payment_initiated'
  | 'payment_completed'
  | 'washer_signup'
  | 'referral_shared'
  | 'subscription_started'
  | 'chat_opened'
  | 'review_submitted';

interface EventParams {
  value?: number;
  currency?: string;
  content_name?: string;
  content_category?: string;
  order_id?: string;
  weight?: number;
  formula?: string;
  [key: string]: unknown;
}

export function useAnalytics() {
  const trackEvent = (eventName: EventName, params?: EventParams) => {
    // Meta Pixel
    if (typeof window !== 'undefined' && window.fbq) {
      const fbEventMap: Record<EventName, string> = {
        signup: 'CompleteRegistration',
        login: 'Login',
        order_started: 'InitiateCheckout',
        order_completed: 'Purchase',
        payment_initiated: 'AddPaymentInfo',
        payment_completed: 'Purchase',
        washer_signup: 'Lead',
        referral_shared: 'Share',
        subscription_started: 'Subscribe',
        chat_opened: 'Contact',
        review_submitted: 'SubmitApplication',
      };

      window.fbq('track', fbEventMap[eventName] || eventName, {
        content_name: params?.content_name,
        content_category: params?.content_category,
        value: params?.value,
        currency: params?.currency || 'EUR',
        ...params,
      });
    }

    // Google Analytics 4 via GTM dataLayer
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: eventName,
        ...params,
      });
    }
  };

  const trackPageView = (pageName: string) => {
    if (typeof window !== 'undefined') {
      // Meta Pixel
      if (window.fbq) {
        window.fbq('track', 'PageView', { page_name: pageName });
      }
      // GA4
      if (window.dataLayer) {
        window.dataLayer.push({
          event: 'page_view',
          page_name: pageName,
        });
      }
    }
  };

  const trackSignup = (method: 'email' | 'google' = 'email') => {
    trackEvent('signup', { content_name: method, content_category: 'auth' });
  };

  const trackLogin = (method: 'email' | 'google' = 'email') => {
    trackEvent('login', { content_name: method, content_category: 'auth' });
  };

  const trackOrderStarted = (formula: string, weight: number) => {
    trackEvent('order_started', {
      content_name: formula,
      content_category: 'order',
      weight,
      formula,
    });
  };

  const trackOrderCompleted = (orderId: string, value: number, weight: number, formula: string) => {
    trackEvent('order_completed', {
      order_id: orderId,
      value,
      currency: 'EUR',
      weight,
      formula,
      content_name: `Order ${orderId}`,
      content_category: 'order',
    });
  };

  const trackPayment = (orderId: string, value: number, status: 'initiated' | 'completed') => {
    trackEvent(status === 'initiated' ? 'payment_initiated' : 'payment_completed', {
      order_id: orderId,
      value,
      currency: 'EUR',
    });
  };

  const trackWasherSignup = () => {
    trackEvent('washer_signup', { content_category: 'washer' });
  };

  const trackReferralShared = (method: 'whatsapp' | 'sms' | 'copy' | 'email') => {
    trackEvent('referral_shared', { content_name: method, content_category: 'referral' });
  };

  const trackSubscriptionStarted = (plan: string, value: number) => {
    trackEvent('subscription_started', {
      content_name: plan,
      value,
      currency: 'EUR',
      content_category: 'subscription',
    });
  };

  return {
    trackEvent,
    trackPageView,
    trackSignup,
    trackLogin,
    trackOrderStarted,
    trackOrderCompleted,
    trackPayment,
    trackWasherSignup,
    trackReferralShared,
    trackSubscriptionStarted,
  };
}

export default useAnalytics;
