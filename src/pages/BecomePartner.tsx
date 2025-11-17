import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Store, MapPin, Phone, Mail, Check, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function BecomePartner() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    postal_code: '',
    city: '',
    phone: '',
    email: '',
    siret: '',
    description: '',
    services: [] as string[],
    opening_hours: '',
  });
  const [loading, setLoading] = useState(false);

  const services = [
    'Nettoyage à sec',
    'Repassage',
    'Retouches',
    'Pressing express (24h)',
    'Traitement cuir',
    'Traitement daim',
    'Lavage rideaux',
    'Nettoyage couettes',
  ];

  const handleServiceToggle = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Insertion demande partenaire
      const { error } = await supabase.from('partner_requests').insert({
        name: formData.name,
        address: formData.address,
        postal_code: formData.postal_code,
        city: formData.city,
        phone: formData.phone,
        email: formData.email,
        siret: formData.siret,
        description: formData.description,
        services: formData.services,
        opening_hours: formData.opening_hours,
        status: 'pending',
      });

      if (error) throw error;

      toast.success('Demande envoyée avec succès ! Nous vous contacterons sous 48h.');
      navigate('/');
    } catch (error: any) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de l\'envoi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-white/60 hover:text-white mb-8 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour
        </button>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <Store className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-white mb-2">
              Devenez Partenaire Kilolab
            </h1>
            <p className="text-white/80 text-lg">
              Rejoignez notre réseau de pressings de confiance
            </p>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 w-20 rounded-full ${
                  step >= s ? 'bg-purple-500' : 'bg-white/20'
                }`}
              />
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Informations de base */}
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white mb-4">
                  Informations de base
                </h2>

                <div>
                  <label className="block text-white/80 mb-2">
                    Nom du pressing *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white"
                    placeholder="Pressing Central Paris"
                  />
                </div>

                <div>
                  <label className="block text-white/80 mb-2">SIRET *</label>
                  <input
                    type="text"
                    required
                    value={formData.siret}
                    onChange={(e) => setFormData({ ...formData, siret: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white"
                    placeholder="123 456 789 00012"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/80 mb-2">Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 mb-2">
                      Téléphone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700"
                >
                  Suivant
                </button>
              </div>
            )}

            {/* Step 2: Adresse */}
            {step === 2 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white mb-4">Adresse</h2>

                <div>
                  <label className="block text-white/80 mb-2">Adresse *</label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/80 mb-2">
                      Code postal *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.postal_code}
                      onChange={(e) =>
                        setFormData({ ...formData, postal_code: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 mb-2">Ville *</label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 bg-white/10 text-white py-3 rounded-lg font-semibold hover:bg-white/20"
                  >
                    Précédent
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700"
                  >
                    Suivant
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Services */}
            {step === 3 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white mb-4">
                  Vos services
                </h2>

                <div className="grid md:grid-cols-2 gap-3">
                  {services.map((service) => (
                    <button
                      key={service}
                      type="button"
                      onClick={() => handleServiceToggle(service)}
                      className={`p-4 rounded-lg border-2 transition flex items-center gap-3 ${
                        formData.services.includes(service)
                          ? 'border-purple-500 bg-purple-500/20'
                          : 'border-white/20 bg-white/5 hover:border-white/40'
                      }`}
                    >
                      {formData.services.includes(service) && (
                        <Check className="w-5 h-5 text-purple-400" />
                      )}
                      <span className="text-white text-sm">{service}</span>
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-white/80 mb-2">
                    Horaires d'ouverture
                  </label>
                  <textarea
                    value={formData.opening_hours}
                    onChange={(e) =>
                      setFormData({ ...formData, opening_hours: e.target.value })
                    }
                    rows={3}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white"
                    placeholder="Lun-Ven: 9h-19h, Sam: 9h-12h"
                  />
                </div>

                <div>
                  <label className="block text-white/80 mb-2">
                    Description (optionnel)
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={4}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white"
                    placeholder="Présentez votre pressing..."
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex-1 bg-white/10 text-white py-3 rounded-lg font-semibold hover:bg-white/20"
                  >
                    Précédent
                  </button>
                  <button
                    type="submit"
                    disabled={loading || formData.services.length === 0}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 disabled:opacity-50"
                  >
                    {loading ? 'Envoi...' : 'Envoyer ma demande'}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Avantages */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 text-center">
            <div className="text-4xl mb-3">📈</div>
            <h3 className="text-white font-bold mb-2">Visibilité accrue</h3>
            <p className="text-white/60 text-sm">
              Touchez de nouveaux clients dans votre zone
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 text-center">
            <div className="text-4xl mb-3">💰</div>
            <h3 className="text-white font-bold mb-2">Sans commission</h3>
            <p className="text-white/60 text-sm">
              Gardez 100% de vos revenus
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 text-center">
            <div className="text-4xl mb-3">🚀</div>
            <h3 className="text-white font-bold mb-2">Gestion simplifiée</h3>
            <p className="text-white/60 text-sm">
              Dashboard intuitif pour gérer vos commandes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
