import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { usePWA } from '../hooks/usePWA';

export default function InstallPrompt() {
  const { isInstallable, installPWA } = usePWA();
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Afficher la bannière après 30 secondes si installable
    const timer = setTimeout(() => {
      if (isInstallable) {
        setShowPrompt(true);
      }
    }, 30000);

    return () => clearTimeout(timer);
  }, [isInstallable]);

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50 animate-in slide-in-from-bottom">
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl shadow-2xl p-6 text-white">
        <div className="flex items-start justify-between mb-4">
          <Download className="w-8 h-8" />
          <button
            onClick={() => setShowPrompt(false)}
            className="text-white/80 hover:text-white transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <h3 className="text-xl font-bold mb-2">
          Installez Kilolab
        </h3>
        <p className="text-blue-100 mb-4">
          Accédez rapidement à vos pressings préférés depuis votre écran d'accueil
        </p>
        
        <button
          onClick={() => {
            installPWA();
            setShowPrompt(false);
          }}
          className="w-full py-3 bg-white text-blue-600 rounded-xl font-bold hover:shadow-xl transition"
        >
          Installer l'application
        </button>
      </div>
    </div>
  );
}
