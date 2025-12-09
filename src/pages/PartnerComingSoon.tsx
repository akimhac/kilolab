import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Clock, CheckCircle, Star, Shield, Bell, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PartnerComingSoon() {
  const navigate = useNavigate();
  const [partnerName, setPartnerName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté et est un partenaire
    const checkPartner = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user?.email) {
        const { data: partner } = await supabase
          .from('partners')
          .select('name, is_active')
          .eq('email', session.user.email.toLowerCase())
          .maybeSingle();

        if (partner) {
          setPartnerName(partner.name);
          
          // Si le partenaire est actif, rediriger vers le dashboard
          if (partner.is_active) {
            navigate('/partner-dashboard');
          }
        }
      }
    };

    checkPartner();
  }, [navigate]);

  const handleNotify = async () => {
    if (!email) {
      toast.error('Veuillez entrer votre email');
      return;
    }
    toast.success('Vous serez notifié dès l\'activation !');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <header className="p-4">
        <Link to="/partners-map" className="flex items-center gap-2 text-slate-600 hover:text-slate-900">
          <ArrowLeft className="w-5 h-5" /> Retour aux pressings
        </Link>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Hero Card */}
        <div className="bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600 rounded-3xl p-8 text-center text-white mb-8">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock className="w-10 h-10" />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {partnerName ? `${partnerName} - Validation en cours` : 'Ce pressing arrive bientôt !'} 🎉
          </h1>
          
          <p className="text-white/90 text-lg">
            {partnerName 
              ? 'Votre inscription est en cours de validation. Notre équipe vous contactera sous 24h.'
              : 'Notre équipe valide ce partenaire pour vous garantir le meilleur service'
            }
          </p>
        </div>

        {/* Notification */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-amber-500" />
            <span className="font-semibold">Soyez prévenu dès l'ouverture</span>
          </div>
          
          <div className="flex gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Votre email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={handleNotify}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition flex items-center gap-2"
            >
              <Bell className="w-4 h-4" /> Me notifier
            </button>
          </div>
        </div>

        {/* Avantages */}
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6">En attendant, découvrez nos pressings partenaires</h2>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-6 border border-slate-100">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">Pressings vérifiés</h3>
              <p className="text-sm text-slate-600">Chaque partenaire est soigneusement sélectionné</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-slate-100">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">Qualité garantie</h3>
              <p className="text-sm text-slate-600">Avis clients et notes transparentes</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-slate-100">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">Paiement sécurisé</h3>
              <p className="text-sm text-slate-600">Payez uniquement au retrait</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <button
            onClick={() => navigate('/partners-map')}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-bold text-lg hover:shadow-xl transition"
          >
            Voir les pressings disponibles
          </button>
          <p className="text-slate-500 text-sm mt-4">
            Plus de 1800 pressings partenaires actifs vous attendent !
          </p>
        </div>
      </div>
    </div>
  );
}
