// Page pour les PARTENAIRES (pas clients) dont le compte est en attente de validation
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Clock, Mail, Phone, LogOut, CheckCircle, Package, Users, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PartnerPending() {
  const navigate = useNavigate();
  const [partner, setPartner] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkPartnerStatus();
  }, []);

  const checkPartnerStatus = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/login');
        return;
      }

      const { data: partnerData } = await supabase
        .from('partners')
        .select('*')
        .eq('email', session.user.email?.toLowerCase())
        .maybeSingle();

      if (!partnerData) {
        navigate('/client-dashboard');
        return;
      }

      if (partnerData.is_active) {
        navigate('/partner-dashboard');
        return;
      }

      setPartner(partnerData);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Déconnexion réussie');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-purple-900">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-white">Kilolab Partenaires</h1>
          <button onClick={handleLogout} className="flex items-center gap-2 text-white/70 hover:text-white transition">
            <LogOut className="w-5 h-5" /> Déconnexion
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Card principale */}
        <div className="bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10 overflow-hidden">
          {/* Header avec statut */}
          <div className="bg-gradient-to-r from-orange-500 to-pink-500 p-8 text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Validation en cours 🎉
            </h2>
            <p className="text-white/90">
              Notre équipe vérifie votre dossier. Vous serez notifié par email sous 24-48h.
            </p>
          </div>

          {/* Infos du pressing */}
          {partner && (
            <div className="p-6 border-b border-white/10">
              <h3 className="text-lg font-bold text-white mb-4">Votre établissement</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-purple-400" />
                  <span className="text-white font-medium">{partner.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-purple-400" />
                  <span className="text-white/70">{partner.email}</span>
                </div>
                {partner.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-purple-400" />
                    <span className="text-white/70">{partner.phone}</span>
                  </div>
                )}
                <div className="text-white/50 text-sm">
                  {partner.address}, {partner.postal_code} {partner.city}
                </div>
              </div>
            </div>
          )}

          {/* Étapes de validation */}
          <div className="p-6">
            <h3 className="text-lg font-bold text-white mb-4">Prochaines étapes</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-white">Inscription reçue</p>
                  <p className="text-white/60 text-sm">Votre demande a bien été enregistrée</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-white">Vérification en cours</p>
                  <p className="text-white/60 text-sm">Notre équipe vérifie vos informations</p>
                </div>
              </div>
              <div className="flex items-start gap-4 opacity-50">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-white">Activation du compte</p>
                  <p className="text-white/60 text-sm">Vous pourrez commencer à recevoir des commandes</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="p-6 bg-white/5 border-t border-white/10">
            <p className="text-white/70 text-center">
              Une question ? Contactez-nous à{' '}
              <a href="mailto:contact@kilolab.fr" className="text-purple-400 hover:underline">
                contact@kilolab.fr
              </a>
            </p>
          </div>
        </div>

        {/* CTA pour explorer */}
        <div className="mt-8 text-center">
          <p className="text-white/60 mb-4">En attendant, découvrez comment fonctionne Kilolab</p>
          <button
            onClick={() => navigate('/how-it-works')}
            className="px-6 py-3 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition flex items-center gap-2 mx-auto"
          >
            Comment ça marche <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
