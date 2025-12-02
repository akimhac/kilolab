// src/pages/PartnerComingSoon.tsx
// Page d'attente pour les clients - Pressing en cours de validation

import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, Clock, Bell, CheckCircle, MapPin, 
  Star, Users, Shield, Sparkles, Gift
} from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function PartnerComingSoon() {
  const navigate = useNavigate();
  const location = useLocation();
  const partner = location.state?.partner;
  const [email, setEmail] = useState('');
  const [notified, setNotified] = useState(false);

  const handleNotifyMe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Veuillez entrer votre email');
      return;
    }
    
    // TODO: Enregistrer l'email pour notification
    toast.success('Vous serez notifié dès que ce pressing sera disponible !');
    setNotified(true);
  };

  const features = [
    {
      icon: CheckCircle,
      title: 'Pressings vérifiés',
      description: 'Chaque partenaire est soigneusement sélectionné'
    },
    {
      icon: Star,
      title: 'Qualité garantie',
      description: 'Avis clients et notes transparentes'
    },
    {
      icon: Shield,
      title: 'Paiement sécurisé',
      description: 'Payez uniquement au retrait'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/partners-map')}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour aux pressings
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Card principale */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Header avec gradient */}
          <div className="bg-gradient-to-r from-orange-400 to-pink-500 p-8 text-white text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-10 h-10" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              Ce pressing arrive bientôt ! 🎉
            </h1>
            <p className="text-white/90">
              Notre équipe valide ce partenaire pour vous garantir le meilleur service
            </p>
          </div>

          {/* Infos pressing */}
          {partner && (
            <div className="p-6 border-b">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-8 h-8 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{partner.name}</h2>
                  <p className="text-slate-600">{partner.address}</p>
                  <p className="text-slate-600">{partner.postal_code} {partner.city}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                      En cours de validation
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Formulaire notification */}
          <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50">
            {notified ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bell className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Vous êtes inscrit ! ✅
                </h3>
                <p className="text-slate-600">
                  Nous vous enverrons un email dès que ce pressing sera disponible.
                </p>
              </div>
            ) : (
              <form onSubmit={handleNotifyMe} className="max-w-md mx-auto">
                <h3 className="text-lg font-bold text-slate-900 mb-4 text-center">
                  🔔 Soyez prévenu dès l'ouverture
                </h3>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Votre email"
                    className="flex-1 px-4 py-3 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition flex items-center gap-2"
                  >
                    <Bell className="w-5 h-5" />
                    Me notifier
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Section alternatives */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">
            En attendant, découvrez nos pressings partenaires
          </h2>
          
          {/* Avantages */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {features.map((feature, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-lg text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center space-y-4">
            <button
              onClick={() => navigate('/partners-map')}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-bold text-lg hover:shadow-xl transition"
            >
              Voir les pressings disponibles
            </button>
            
            <p className="text-slate-500">
              Plus de 2600 pressings partenaires vous attendent !
            </p>
          </div>
        </div>

        {/* Offre parrainage */}
        <div className="mt-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-3xl p-8 text-center text-white">
          <Gift className="w-12 h-12 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">Gagnez 10€ de réduction !</h3>
          <p className="text-white/90 mb-6">
            Inscrivez-vous maintenant et recevez 10€ sur votre première commande
          </p>
          <button
            onClick={() => navigate('/signup')}
            className="px-8 py-3 bg-white text-orange-600 rounded-xl font-bold hover:shadow-lg transition"
          >
            Créer mon compte gratuitement
          </button>
        </div>
      </div>
    </div>
  );
}
