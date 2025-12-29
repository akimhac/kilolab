// Tracking GTM events
export const trackEvent = (eventName: string, params?: Record<string, any>) => {
  if (typeof window !== "undefined" && window.dataLayer) {
    window.dataLayer.push({
      event: eventName,
      ...params,
    });
    console.log("📊 Event tracked:", eventName, params);
  }
};

// Events spécifiques
export const analytics = {
  // Inscription
  signupStarted: () => trackEvent("signup_started"),
  signupCompleted: (method: string) =>
    trackEvent("signup_completed", { method }),

  // Commandes
  orderStarted: () => trackEvent("order_started"),
  orderCompleted: (orderId: string, value: number) =>
    trackEvent("order_completed", {
      order_id: orderId,
      value,
      currency: "EUR",
    }),

  // Paiement
  checkoutStarted: (orderId: string, value: number) =>
    trackEvent("begin_checkout", {
      order_id: orderId,
      value,
      currency: "EUR",
    }),
  paymentCompleted: (orderId: string, value: number) =>
    trackEvent("purchase", {
      transaction_id: orderId,
      value,
      currency: "EUR",
    }),

  // Partenaires
  partnerSelected: (partnerId: string, city: string) =>
    trackEvent("partner_selected", {
      partner_id: partnerId,
      city,
    }),

  // Support
  contactFormSubmitted: (subject: string) =>
    trackEvent("contact_form_submitted", { subject }),
};
