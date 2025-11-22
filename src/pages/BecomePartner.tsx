import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Euro, Users, TrendingUp, CheckCircle, Gift, Sparkles, Award, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import LoadingButton from '../components/LoadingButton';

export default function BecomePartner() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postal_code: '',
    siret: '',
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Créer un compte auth pour le pressing
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: Math.random().toString(36).slice(-8) + 'Aa1!', // Mot de passe temporaire
        options: {
          data: {
            user_type: 'partner',
            name: formData.name
          }
        }
      });

      if (authError) throw authError;

      // Insérer dans la table partners
      const { error: partnerError } = await supabase
        .from('partners')
        .insert([{
          user_id: authData.user?.id,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          postal_code: formData.postal_code,
          siret: formData.siret,
          description: formData.description,
          is_active: false, // Inactif par défaut, en attente validation
          latitude: 48.8566,
          longitude: 2.3522
        }]);

      if (partnerError) throw partnerError;

      toast.success('Inscription envoyée ! Nous vous contacterons sous 24-48h.');
      navigate('/');
    } catch (error: any) {
      console.error('Erreur inscription:', error);
      toast.error(error.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold text-sm mb-6">
            <Sparkles className="w-4 h-4" />
            Rejoignez le réseau Kilolab
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6">
            Devenez pressing{' '}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              partenaire
            </span>
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            Développez votre activité en rejoignant le réseau de 2600+ pressings partenaires
          </p>
        </div>
      </section>

      {/* BANNIÈRE PROMO 1 MOIS GRATUIT */}
      <div className="max-w-4xl mx-auto px-4 -mt-8 mb-12">
        <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-green-600 rounded-3xl shadow-2xl p-8 text-white">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full mb-4">
              <Gift className="w-5 h-5" />
              <span className="font-bold">🎁 OFFRE DE LANCEMENT 🎁</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black mb-3">
              1er mois GRATUIT
            </h2>
            <p className="text-xl text-green-100">
              Pour les 100 premiers pressings inscrits
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <CheckCircle className="w-6 h-6 flex-shrink-0" />
              <span className="font-semibold">0€ pendant 30 jours</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <CheckCircle className="w-6 h-6 flex-shrink-0" />
              <span className="font-semibold">Visibilité immédiate</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <CheckCircle className="w-6 h-6 flex-shrink-0" />
              <span className="font-semibold">Support 7j/7</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <CheckCircle className="w-6 h-6 flex-shrink-0" />
              <span className="font-semibold">Formation incluse</span>
            </div>
          </div>

          <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <p className="text-lg mb-2">
              Après 30 jours : <strong>seulement 10% de commission</strong> sur chaque commande
            </p>
            <p className="text-green-100 text-sm">
              ⏰ Places limitées • Déjà 23 inscrits • Il reste 77 places
            </p>
          </div>
        </div>
      </div>

      {/* Avantages */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-black text-center text-slate-900 mb-12">
            Pourquoi rejoindre Kilolab ?
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Nouveaux clients
              </h3>
              <p className="text-slate-600">
                Accédez à notre base de clients actifs et augmentez votre chiffre d'affaires
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Euro className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Commission faible
              </h3>
              <p className="text-slate-600">
                Seulement 10% de commission après le 1er mois gratuit. La plus basse du marché.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Visibilité
              </h3>
              <p className="text-slate-600">
                Apparaissez sur notre carte interactive consultée par des milliers de clients
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-600 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Gestion simplifiée
              </h3>
              <p className="text-slate-600">
                Dashboard complet pour gérer vos commandes et suivre vos revenus
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="py-20 px-4 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-black text-center text-slate-900 mb-12">
            Comment ça marche ?
          </h2>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-black">
                1
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Inscription</h3>
              <p className="text-sm text-slate-600">
                Remplissez le formulaire ci-dessous
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-black">
                2
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Validation</h3>
              <p className="text-sm text-slate-600">
                Nous vérifions vos informations (24-48h)
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-black">
                3
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Activation</h3>
              <p className="text-sm text-slate-600">
                Vous apparaissez sur la carte Kilolab
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-black">
                4
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Commandes</h3>
              <p className="text-sm text-slate-600">
                Recevez vos premières commandes !
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Formulaire */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <h2 className="text-3xl font-black text-slate-900 mb-6">
              Formulaire d'inscription
            </h2>
            <p className="text-slate-600 mb-8">
              Rejoignez gratuitement le réseau Kilolab et bénéficiez de votre 1er mois offert !
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  Nom du pressing *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-blue-600 focus:outline-none"
                  placeholder="Pressing du Centre"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-blue-600 focus:outline-none"
                    placeholder="contact@pressing.fr"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">
                    Téléphone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-blue-600 focus:outline-none"
                    placeholder="06 12 34 56 78"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  Adresse *
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-blue-600 focus:outline-none"
                  placeholder="15 rue de la République"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">
                    Ville *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-blue-600 focus:outline-none"
                    placeholder="Paris"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">
                    Code postal *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.postal_code}
                    onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-blue-600 focus:outline-none"
                    placeholder="75001"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  SIRET *
                </label>
                <input
                  type="text"
                  required
                  value={formData.siret}
                  onChange={(e) => setFormData({ ...formData, siret: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-blue-600 focus:outline-none"
                  placeholder="123 456 789 00012"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  Description (optionnel)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-blue-600 focus:outline-none"
                  placeholder="Décrivez votre pressing, vos services..."
                />
              </div>

              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    required
                    className="mt-1 w-5 h-5"
                  />
                  <p className="text-sm text-slate-700">
                    J'accepte les{' '}
                    <button
                      type="button"
                      onClick={() => navigate('/legal/cgu')}
                      className="text-blue-600 hover:underline font-semibold"
                    >
                      Conditions Générales d'Utilisation
                    </button>{' '}
                    et la{' '}
                    <button
                      type="button"
                      onClick={() => navigate('/legal/privacy')}
                      className="text-blue-600 hover:underline font-semibold"
                    >
                      Politique de Confidentialité
                    </button>
                    . J'accepte de payer une commission de 10% sur chaque commande après le 1er mois gratuit.
                  </p>
                </div>
              </div>

              <LoadingButton
                type="submit"
                loading={loading}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold text-lg hover:shadow-2xl transition"
              >
                Devenir partenaire gratuitement
              </LoadingButton>

              <p className="text-center text-sm text-slate-500">
                En vous inscrivant, vous bénéficiez automatiquement du 1er mois gratuit
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-cyan-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-black mb-6">
            Des questions ?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Notre équipe est là pour vous accompagner
          </p>
          <button
            onClick={() => navigate('/contact')}
            className="px-12 py-5 bg-white text-blue-600 rounded-xl font-bold text-xl hover:shadow-2xl transition transform hover:scale-105"
          >
            Contactez-nous
          </button>
        </div>
      </section>
    </div>
  );
}
