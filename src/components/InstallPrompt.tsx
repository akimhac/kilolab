import { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';
import { usePWA } from '../hooks/usePWA';

export default function InstallPrompt() {
  const { isInstallable, isInstalled, installPWA } = usePWA();
  const [showPrompt, setShowPrompt] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Ne pas afficher si déjà installée ou dismissed
    if (isInstalled || dismissed) return;

    // Vérifier localStorage
    const wasDismissed = localStorage.getItem('pwa-prompt-dismissed');
    if (wasDismissed) {
      setDismissed(true);
      return;
    }

    // Afficher après 30 secondes si installable
    const timer = setTimeout(() => {
      if (isInstallable && !isInstalled) {
        setShowPrompt(true);
      }
    }, 30000);

    return () => clearTimeout(timer);
  }, [isInstallable, isInstalled, dismissed]);

  const handleDismiss = () => {
    setShowPrompt(false);
    setDismissed(true);
    localStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  const handleInstall = async () => {
    const success = await installPWA();
    if (success) {
      setShowPrompt(false);
    }
  };

  if (!showPrompt || isInstalled) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50 animate-in slide-in-from-bottom duration-300">
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl shadow-2xl p-6 text-white">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Smartphone className="w-6 h-6" />
            </div>
            <Download className="w-8 h-8" />
          </div>
          <button
            onClick={handleDismiss}
            className="text-white/80 hover:text-white transition"
            aria-label="Fermer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <h3 className="text-xl font-bold mb-2">
          Installez Kilolab sur votre téléphone
        </h3>
        <p className="text-blue-100 mb-4 text-sm leading-relaxed">
          Accédez rapidement à vos pressings préférés depuis votre écran d'accueil. 
          Notifications en temps réel pour vos commandes.
        </p>
        
        <div className="flex gap-3">
          <button
            onClick={handleInstall}
            className="flex-1 py-3 bg-white text-blue-600 rounded-xl font-bold hover:shadow-xl transition"
          >
            Installer maintenant
          </button>
          <button
            onClick={handleDismiss}
            className="px-4 py-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl font-semibold transition"
          >
            Plus tard
          </button>
        </div>
      </div>
    </div>
  );
}
