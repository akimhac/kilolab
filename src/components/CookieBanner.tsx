import { useState, useEffect } from 'react';
import { X, Cookie } from 'lucide-react';

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setTimeout(() => setShowBanner(true), 1000);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem('cookie-consent', 'all');
    setShowBanner(false);
  };

  const acceptEssential = () => {
    localStorage.setItem('cookie-consent', 'essential');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-slide-up">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl border-2 border-blue-200 p-6">
        <div className="flex items-start gap-4">
          <Cookie className="w-8 h-8 text-blue-600 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              🍪 Nous utilisons des cookies
            </h3>
            <p className="text-slate-600 mb-4">
              Nous utilisons des cookies essentiels pour le fonctionnement du site et des cookies analytiques 
              (avec votre consentement) pour améliorer votre expérience.{' '}
              <a href="/legal/privacy" className="text-blue-600 hover:underline font-semibold">
                En savoir plus
              </a>
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={acceptAll}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold hover:shadow-lg transition"
              >
                Tout accepter
              </button>
              <button
                onClick={acceptEssential}
                className="px-6 py-3 bg-slate-200 text-slate-900 rounded-xl font-bold hover:bg-slate-300 transition"
              >
                Cookies essentiels uniquement
              </button>
            </div>
          </div>
          <button
            onClick={acceptEssential}
            className="text-slate-400 hover:text-slate-600 transition"
            aria-label="Fermer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
