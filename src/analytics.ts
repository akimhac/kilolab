// Google Tag Manager & Analytics tracking

declare global {
  interface Window {
    dataLayer: any[];
  }
}

export const analytics = {
  // Page view
  pageView: (path: string) => {
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'page_view',
        page_path: path,
        page_title: document.title
      });
    }
  },

  // Commande créée
  orderCreated: (orderId: string, amount: number, serviceType: string) => {
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'order_created',
        order_id: orderId,
        value: amount,
        service_type: serviceType
      });
    }
  },

  // Paiement réussi
  paymentSuccess: (orderId: string, amount: number) => {
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'purchase',
        transaction_id: orderId,
        value: amount,
        currency: 'EUR'
      });
    }
  },

  // Pressing consulté
  partnerViewed: (partnerId: string, partnerName: string) => {
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'partner_viewed',
        partner_id: partnerId,
        partner_name: partnerName
      });
    }
  },

  // Inscription pressing
  partnerSignup: (partnerEmail: string) => {
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'partner_signup',
        partner_email: partnerEmail
      });
    }
  },

  // CTA cliqué
  ctaClicked: (location: string, ctaText: string) => {
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'cta_clicked',
        cta_location: location,
        cta_text: ctaText
      });
    }
  },

  // Contact form soumis
  contactFormSubmitted: (name: string, email: string) => {
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'contact_form_submitted',
        contact_name: name,
        contact_email: email
      });
    }
  },

  // Newsletter inscription
  newsletterSubscribed: (email: string) => {
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'newsletter_subscribed',
        newsletter_email: email
      });
    }
  },

  // Recherche effectuée
  searchPerformed: (query: string, resultsCount: number) => {
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'search',
        search_term: query,
        results_count: resultsCount
      });
    }
  },

  // Event générique - AJOUT DE LA MÉTHODE MANQUANTE
  trackEvent: (eventName: string, eventParams?: Record<string, any>) => {
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: eventName,
        ...eventParams
      });
    }
  },

  // Login
  userLogin: (userId: string, method: string) => {
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'login',
        user_id: userId,
        method: method
      });
    }
  },

  // Signup
  userSignup: (userId: string, method: string) => {
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'sign_up',
        user_id: userId,
        method: method
      });
    }
  },

  // FAQ question ouverte
  faqQuestionOpened: (question: string, category: string) => {
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'faq_question_opened',
        question_text: question,
        question_category: category
      });
    }
  },

  // Blog article lu
  blogArticleRead: (articleTitle: string, articleId: string) => {
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'blog_article_read',
        article_title: articleTitle,
        article_id: articleId
      });
    }
  },

  // Erreur rencontrée
  errorOccurred: (errorMessage: string, errorLocation: string) => {
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'error',
        error_message: errorMessage,
        error_location: errorLocation
      });
    }
  },

  // Filter appliqué (carte des pressings)
  filterApplied: (filterType: string, filterValue: string) => {
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'filter_applied',
        filter_type: filterType,
        filter_value: filterValue
      });
    }
  },

  // Avis laissé
  reviewSubmitted: (rating: number, orderId: string) => {
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'review_submitted',
        rating: rating,
        order_id: orderId
      });
    }
  },

  // Partage social
  socialShare: (platform: string, content: string) => {
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'social_share',
        platform: platform,
        content: content
      });
    }
  },

  // Téléchargement
  fileDownloaded: (fileName: string, fileType: string) => {
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'file_download',
        file_name: fileName,
        file_type: fileType
      });
    }
  },

  // Vidéo lue
  videoPlayed: (videoTitle: string, videoId: string) => {
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'video_play',
        video_title: videoTitle,
        video_id: videoId
      });
    }
  },

  // Temps passé sur page
  timeOnPage: (pagePath: string, timeSeconds: number) => {
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'time_on_page',
        page_path: pagePath,
        time_seconds: timeSeconds
      });
    }
  }
};
