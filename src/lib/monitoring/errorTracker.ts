import { supabase } from '../supabase';

interface ErrorLogData {
  error_type: 'javascript' | 'react' | 'api' | 'payment';
  message: string;
  stack_trace?: string;
  severity?: 'info' | 'warning' | 'error' | 'critical';
  metadata?: Record<string, any>;
}

/**
 * 🔥 Système d'Error Tracking maison (Alternative gratuite à Sentry)
 */
class ErrorTracker {
  private async logToSupabase(data: ErrorLogData) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      await supabase.from('error_logs').insert({
        ...data,
        user_id: user?.id || null,
        user_agent: navigator.userAgent,
        url: window.location.href,
      });
    } catch (error) {
      // Fallback si Supabase est down
      console.error('Failed to log error:', error);
    }
  }

  /**
   * Logger une erreur JavaScript
   */
  captureException(error: Error, metadata?: Record<string, any>) {
    this.logToSupabase({
      error_type: 'javascript',
      message: error.message,
      stack_trace: error.stack,
      severity: 'error',
      metadata,
    });

    // Log aussi dans la console pour dev
    if (import.meta.env.DEV) {
      console.error('🔴 Error captured:', error, metadata);
    }
  }

  /**
   * Logger une erreur API
   */
  captureAPIError(endpoint: string, error: any, statusCode?: number) {
    this.logToSupabase({
      error_type: 'api',
      message: `API Error: ${endpoint}`,
      stack_trace: JSON.stringify(error),
      severity: statusCode && statusCode >= 500 ? 'critical' : 'error',
      metadata: { endpoint, statusCode, error },
    });
  }

  /**
   * Logger une erreur de paiement (CRITIQUE)
   */
  capturePaymentError(error: any, orderId?: string, amount?: number) {
    this.logToSupabase({
      error_type: 'payment',
      message: `Payment failed: ${error.message || 'Unknown error'}`,
      stack_trace: JSON.stringify(error),
      severity: 'critical',
      metadata: { orderId, amount, error },
    });

    // Alert immédiate en prod
    if (import.meta.env.PROD) {
      console.error('💰 PAYMENT ERROR:', { orderId, amount, error });
    }
  }

  /**
   * Logger une erreur React (via Error Boundary)
   */
  captureReactError(error: Error, errorInfo: any) {
    this.logToSupabase({
      error_type: 'react',
      message: error.message,
      stack_trace: error.stack,
      severity: 'error',
      metadata: { componentStack: errorInfo.componentStack },
    });
  }

  /**
   * Logger un message custom
   */
  captureMessage(message: string, severity: 'info' | 'warning' | 'error' = 'info') {
    this.logToSupabase({
      error_type: 'javascript',
      message,
      severity,
    });
  }
}

// Instance globale
export const errorTracker = new ErrorTracker();

// Setup global error handlers
if (typeof window !== 'undefined') {
  // Capturer les erreurs JS non gérées
  window.onerror = (message, source, lineno, colno, error) => {
    errorTracker.captureException(
      error || new Error(String(message)),
      { source, lineno, colno }
    );
  };

  // Capturer les promesses rejetées non gérées
  window.onunhandledrejection = (event) => {
    errorTracker.captureException(
      new Error(`Unhandled Promise Rejection: ${event.reason}`),
      { reason: event.reason }
    );
  };
}