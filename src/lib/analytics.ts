import posthog from 'posthog-js';

export const initAnalytics = () => {
  if (import.meta.env.VITE_POSTHOG_KEY) {
    posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
      api_host: 'https://app.posthog.com',
    });
  }
};

export const trackEvent = (event: string, properties?: Record<string, any>) => {
  if (import.meta.env.VITE_POSTHOG_KEY) {
    posthog.capture(event, properties);
  }
};

export const identifyUser = (userId: string, traits?: Record<string, any>) => {
  if (import.meta.env.VITE_POSTHOG_KEY) {
    posthog.identify(userId, traits);
  }
};
