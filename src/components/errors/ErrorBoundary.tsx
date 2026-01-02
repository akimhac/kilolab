import React, { Component, ReactNode } from 'react';
import { errorTracker } from '../../lib/monitoring/errorTracker';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * 🛡️ Error Boundary - Capture les erreurs React
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Logger dans notre système maison
    errorTracker.captureReactError(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI custom si fourni
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Fallback UI par défaut
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="text-red-600" size={32} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Oups, quelque chose s'est mal passé
            </h1>
            <p className="text-slate-600 mb-6">
              Une erreur inattendue s'est produite. Notre équipe a été notifiée et travaille sur une solution.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-xl transition"
              >
                Recharger la page
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-4 rounded-xl transition"
              >
                Retour à l'accueil
              </button>
            </div>
            {import.meta.env.DEV && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-slate-500 hover:text-slate-700">
                  Détails de l'erreur (dev only)
                </summary>
                <pre className="mt-2 text-xs bg-slate-50 p-3 rounded-lg overflow-auto max-h-40">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}