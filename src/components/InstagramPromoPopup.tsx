import { useState, useEffect } from 'react';
import { X, Instagram, Gift, Mail } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export default function InstagramPromoPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'initial' | 'emailForm' | 'success'>('initial');

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà vu le popup
    const hasSeenPopup = localStorage.getItem('kilolab_instagram_popup_seen');
    const lastShown = localStorage.getItem('kilolab_instagram_popup_last_shown');

    // Afficher uniquement si :
    // 1. Pas vu depuis 7 jours
    // 2. Ou jamais vu
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    
    if (!hasSeenPopup || (lastShown && parseInt(lastShown) < sevenDaysAgo)) {
      // Afficher après 5 secondes de navigation
      const timer = setTimeout(() => {
        setIsVisible(true);
        localStorage.setItem('kilolab_instagram_popup_last_shown', Date.now().toString());
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('kilolab_instagram_popup_seen', 'true');
  };

  const handleInstagramClick = () => {
    // Ouvrir Instagram dans un nouvel onglet
    window.open('https://www.instagram.com/kilolab.fr', '_blank');
    
    // Passer à l'étape email
    setStep('emailForm');
    
    toast.success('✅ Merci de nous suivre sur Instagram !', { duration: 3000 });
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast.error('❌ Email invalide');
      return;
    }

    setLoading(true);

    try {
      // Générer un code promo unique
      const couponCode = `INSTA5-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

      // Enregistrer dans la table coupons
      const { error: couponError } = await supabase
        .from('coupons')
        .insert({
          code: couponCode,
          discount_type: 'percentage',
          discount_value: 5,
          email: email.toLowerCase(),
          source: 'instagram_popup',
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 jours
          created_at: new Date().toISOString()
        });

      if (couponError) {
        console.error('Erreur création coupon:', couponError);
        throw new Error('Erreur lors de la création du coupon');
      }

      // Envoyer l'email avec le coupon
      const { error: emailError } = await supabase.functions.invoke('send-instagram-coupon', {
        body: {
          email: email.toLowerCase(),
          coupon_code: couponCode
        }
      });

      if (emailError) {
        console.error('Erreur envoi email:', emailError);
        // Continuer quand même, le coupon est créé
      }

      setStep('success');
      toast.success('🎉 Coupon envoyé par email !');

      // Fermer automatiquement après 5 secondes
      setTimeout(() => {
        handleClose();
      }, 5000);

    } catch (error: any) {
      console.error('Erreur:', error);
      toast.error('❌ Erreur : ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fade-in"
        onClick={handleClose}
      />

      {/* Popup */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4 animate-scale-in">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center transition z-10"
          >
            <X size={20} className="text-slate-600" />
          </button>

          {/* STEP 1 : INITIAL */}
          {step === 'initial' && (
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
                <Instagram size={40} className="text-white" />
              </div>
              
              <h2 className="text-3xl font-black mb-3 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                5% de réduction !
              </h2>
              
              <p className="text-slate-600 mb-6 text-lg leading-relaxed">
                Suivez-nous sur <strong className="text-pink-600">@kilolab.fr</strong> et recevez 
                un <strong>coupon de 5%</strong> par email ! 🎁
              </p>

              <button
                onClick={handleInstagramClick}
                className="w-full py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 text-white rounded-xl font-bold text-lg hover:shadow-2xl transition-all transform hover:scale-105 flex items-center justify-center gap-3 mb-4"
              >
                <Instagram size={24} />
                Suivre sur Instagram
              </button>

              <button
                onClick={handleClose}
                className="text-sm text-slate-400 hover:text-slate-600 transition"
              >
                Non merci, je passe
              </button>
            </div>
          )}

          {/* STEP 2 : EMAIL FORM */}
          {step === 'emailForm' && (
            <div className="p-8">
              <div className="w-16 h-16 bg-teal-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Mail size={32} className="text-teal-600" />
              </div>
              
              <h3 className="text-2xl font-bold mb-3 text-center">
                Où envoyer votre coupon ?
              </h3>
              
              <p className="text-slate-600 text-center mb-6">
                Recevez votre code <strong className="text-teal-600">-5%</strong> par email
              </p>

              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre@email.com"
                    className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none text-lg"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl font-bold hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Gift size={20} />
                      Recevoir mon coupon
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* STEP 3 : SUCCESS */}
          {step === 'success' && (
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Gift size={40} className="text-green-600" />
              </div>
              
              <h3 className="text-2xl font-bold mb-3 text-green-600">
                Coupon envoyé ! 🎉
              </h3>
              
              <p className="text-slate-600 mb-6">
                Vérifiez votre boîte mail (et vos spams) pour récupérer votre code promo <strong>-5%</strong>
              </p>

              <div className="bg-teal-50 border-2 border-teal-200 rounded-xl p-4 mb-6">
                <p className="text-sm text-teal-700">
                  <strong>💡 Astuce :</strong> Valable 30 jours sur votre prochaine commande !
                </p>
              </div>

              <button
                onClick={handleClose}
                className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-black transition"
              >
                Compris !
              </button>
            </div>
          )}

        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-in {
          from { 
            opacity: 0; 
            transform: translate(-50%, -50%) scale(0.9);
          }
          to { 
            opacity: 1; 
            transform: translate(-50%, -50%) scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </>
  );
}
