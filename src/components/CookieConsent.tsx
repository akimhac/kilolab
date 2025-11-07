import { useState, useEffect } from 'react';
import { Cookie, X } from 'lucide-react';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasConsented = localStorage.getItem('cookieConsent');
    if (!hasConsented) {
      setTimeout(() => setIsVisible(true), 1000);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 p-6 z-50 animate-in slide-in-from-bottom duration-500">
      <div className="max-w-4xl mx-auto bg-slate-900/95 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl">
        <div className="flex items-start gap-4">
          <Cookie className="w-8 h-8 text-yellow-400 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-2">
              🍪 Nous utilisons des cookies
            </h3>
            <p className="text-white/70 text-sm mb-4">
              Nous utilisons des cookies pour améliorer votre expérience. 
              En cliquant sur Accepter, vous consentez à l utilisation de tous les cookies.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleAccept}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-all"
              >
                Accepter
              </button>
              <button
                onClick={handleDecline}
                className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg font-semibold transition-all"
              >
                Refuser
              </button>
            </div>
          </div>
          <button
            onClick={handleDecline}
            className="text-white/60 hover:text-white flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
