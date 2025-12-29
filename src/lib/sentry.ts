import * as Sentry from "@sentry/react";

export const initSentry = () => {
  if (import.meta.env.PROD) {
    Sentry.init({
      dsn: "https://XXXXXXXXX@o0000000.ingest.sentry.io/0000000",
      environment: import.meta.env.MODE,
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration({
          maskAllText: true,
          blockAllMedia: true,
        }),
      ],
      tracesSampleRate: 1.0, // 100% des transactions
      replaysSessionSampleRate: 0.1, // 10% des sessions
      replaysOnErrorSampleRate: 1.0, // 100% en cas d'erreur
    });
  }
};
