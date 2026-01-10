import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { createConnectAccount } from '../lib/stripe';
import { CreditCard, CheckCircle, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ConnectStripe() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/login?type=partner');
      return;
    }

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'partner') {
      toast.error('Accès réservé aux pressings');
      navigate('/');
      return;
    }

    setUser(user);
    setProfile(profile);
    setLoading(false);
  };

  const handleConnectStripe = async () => {
    setConnecting(true);

    try {
      const data = await createConnectAccount(
        user.email!,
        profile.business_name || 'Mon Pressing',
        user.id
      );

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('URL manquante');
      }
    } catch (error: any) {
      console.error('Erreur Stripe:', error);
      toast.error(error.message || 'Erreur');
      setConnecting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-teal-600" size={48} />
      </div>
    );
  }

  if (profile?.stripe_account_id && profile?.stripe_onboarding_complete) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <button onClick={() => navigate('/partner-dashboard')} className="flex items-center gap-2 text-gray-600 hover:text-teal-600 mb-8">
            <ArrowLeft size={20} /> Retour
          </button>
          <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Stripe connecté ! 🎉</h1>
            <p className="text-gray-600 mb-8">Votre compte de paiement est actif</p>
            <div className="bg-teal-50 border-2 border-teal-200 rounded-2xl p-6 mb-6">
              <p className="text-sm font-bold text-teal-900 mb-2">ID Stripe Connect</p>
              <p className="text-xs text-teal-700 font-mono break-all">{profile.stripe_account_id}</p>
            </div>
            
            <a 
              href="https://dashboard.stripe.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-teal-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-teal-700"
            >
              <CreditCard size={20} /> Tableau de bord Stripe
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <button onClick={() => navigate('/partner-dashboard')} className="flex items-center gap-2 text-gray-600 hover:text-teal-600 mb-8">
          <ArrowLeft size={20} /> Retour
        </button>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-teal-600 to-cyan-600 p-8 text-white text-center">
            <CreditCard className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Connectez Stripe</h1>
            <p className="text-teal-100">Recevez vos paiements directement</p>
          </div>

          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Pourquoi Stripe ?</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-bold">Paiements directs</p>
                    <p className="text-sm text-gray-600">Argent sur votre compte sous 2-3 jours</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-bold">15% de commission Kilolab</p>
                    <p className="text-sm text-gray-600">Vous recevez 85% du montant net</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-bold">Sécurisé</p>
                    <p className="text-sm text-gray-600">Utilisé par des millions d'entreprises</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-teal-50 border-2 border-teal-200 rounded-2xl p-6 mb-8">
              <h3 className="font-bold text-teal-900 mb-4">Exemple :</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Client paie</span>
                  <span className="font-bold">50.00 €</span>
                </div>
                <div className="flex justify-between">
                  <span>Frais Stripe (1.4% + 0.25€)</span>
                  <span className="text-red-600">- 0.95 €</span>
                </div>
                <div className="h-px bg-teal-300 my-2"></div>
                <div className="flex justify-between text-base">
                  <span className="font-bold">Vous recevez (85%)</span>
                  <span className="font-bold text-teal-900">41.69 €</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Commission Kilolab (15%)</span>
                  <span>7.36 €</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 mb-6 flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0" />
              <div className="text-sm text-blue-900">
                <p className="font-bold mb-1">Documents nécessaires :</p>
                <p>IBAN, SIRET, pièce d'identité</p>
              </div>
            </div>

            <button
              onClick={handleConnectStripe}
              disabled={connecting}
              className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-4 rounded-xl font-bold hover:from-teal-700 hover:to-cyan-700 transition-all shadow-lg shadow-teal-200 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {connecting ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Connexion...
                </>
              ) : (
                <>
                  <CreditCard size={20} />
                  Connecter mon Stripe
                </>
              )}
            </button>

            <p className="text-center text-xs text-gray-500 mt-4">
              Vous serez redirigé vers Stripe pour finaliser
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
