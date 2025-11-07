import { useState, useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PromoPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const hasSeenPromo = localStorage.getItem('hasSeenPromo');
    if (!hasSeenPromo) {
      setTimeout(() => setIsVisible(true), 2000);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('hasSeenPromo', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 z-50 animate-in fade-in duration-300">
      <div className="bg-gradient-to-br from-purple-900 to-blue-900 rounded-3xl max-w-lg w-full p-8 border-2 border-yellow-400 relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-20">
          <Sparkles className="w-32 h-32 text-yellow-400" />
        </div>

        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white transition-all"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="relative z-10">
          <div className="text-center mb-6">
            <div className="inline-block px-4 py-2 bg-yellow-400/20 text-yellow-300 rounded-full text-sm font-bold mb-4">
              🎉 OFFRE DE LANCEMENT
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">
              -30% sur votre<br />première commande !
            </h2>
            <p className="text-white/80 text-lg">
              Profitez de notre offre de bienvenue exclusive.<br />
              Code promo : <span className="font-bold text-yellow-300">KILOLAB30</span>
            </p>
          </div>

          <button
            onClick={() => {
              handleClose();
              navigate('/signup');
            }}
            className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-slate-900 py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-yellow-400/50"
          >
            J en profite maintenant
          </button>

          <button
            onClick={handleClose}
            className="w-full mt-3 text-white/60 hover:text-white py-2 text-sm transition-all"
          >
            Non merci
          </button>
        </div>
      </div>
    </div>
  );
}
