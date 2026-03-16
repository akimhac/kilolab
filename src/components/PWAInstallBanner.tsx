import { useState, useEffect } from 'react';
import { X, Download, Smartphone } from 'lucide-react';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

export default function PWAInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    // Check if already installed or dismissed
    const dismissed = localStorage.getItem('pwa-banner-dismissed');
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    
    if (dismissed || isStandalone) return;

    // Detect iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    if (iOS) {
      // Show banner after 3 seconds on iOS
      setTimeout(() => setShowBanner(true), 3000);
      return;
    }

    // Listen for beforeinstallprompt (Android/Chrome)
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setTimeout(() => setShowBanner(true), 2000);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (isIOS) {
      setShowIOSInstructions(true);
      return;
    }

    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('pwa-banner-dismissed', 'true');
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Main Install Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-slide-up">
        <div className="max-w-md mx-auto bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl shadow-2xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <Smartphone className="text-white" size={24} />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-bold text-sm">Installez Kilolab</h3>
            <p className="text-teal-100 text-xs mt-0.5">
              Accès rapide depuis votre écran d'accueil
            </p>
          </div>

          <button
            onClick={handleInstall}
            className="px-4 py-2 bg-white text-teal-600 rounded-xl font-bold text-sm hover:bg-teal-50 transition flex items-center gap-1.5 flex-shrink-0"
          >
            <Download size={16} />
            Installer
          </button>

          <button
            onClick={handleDismiss}
            className="p-1.5 text-white/70 hover:text-white transition flex-shrink-0"
            aria-label="Fermer"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* iOS Instructions Modal */}
      {showIOSInstructions && (
        <div className="fixed inset-0 z-[60] bg-black/60 flex items-end justify-center p-4">
          <div className="bg-white rounded-t-3xl w-full max-w-md animate-slide-up">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-slate-900">Installer sur iPhone</h3>
                <button
                  onClick={() => setShowIOSInstructions(false)}
                  className="p-2 text-slate-400 hover:text-slate-600"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 text-teal-600 font-bold">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Appuyez sur le bouton Partager</p>
                    <p className="text-sm text-slate-500 mt-1">
                      L'icône <span className="inline-block w-5 h-5 align-middle">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13"/>
                        </svg>
                      </span> en bas de Safari
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 text-teal-600 font-bold">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Sélectionnez "Sur l'écran d'accueil"</p>
                    <p className="text-sm text-slate-500 mt-1">
                      Faites défiler vers le bas pour trouver cette option
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 text-teal-600 font-bold">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Appuyez sur "Ajouter"</p>
                    <p className="text-sm text-slate-500 mt-1">
                      Kilolab sera ajouté à votre écran d'accueil
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowIOSInstructions(false);
                  handleDismiss();
                }}
                className="w-full mt-6 py-3 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition"
              >
                J'ai compris
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up {
          animation: slide-up 0.4s ease-out;
        }
      `}</style>
    </>
  );
}
