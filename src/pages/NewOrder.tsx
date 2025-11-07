import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { MapPin, Package, Clock, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';

interface Partner {
  id: string;
  name: string;
  address: string;
  city: string;
  postal_code: string;
}

export default function NewOrder() {
  const navigate = useNavigate();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    partnerId: '',
    speed: 'express',
    notes: '',
  });

  useEffect(() => {
    loadPartners();
  }, []);

  const loadPartners = async () => {
    try {
      const { data } = await supabase
        .from('partners')
        .select('id, name, address, city, postal_code')
        .eq('is_active', true)
        .order('city');

      setPartners(data || []);
    } catch (error) {
      console.error('Erreur chargement partenaires:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('email', user.email)
        .single();

      if (!profile) {
        alert('Profil introuvable');
        return;
      }

      const pricePerKg = formData.speed === 'premium' ? 500 : formData.speed === 'express' ? 1000 : 1500;

      const { data: order, error } = await supabase
        .from('orders')
        .insert({
          client_id: profile.id,
          partner_id: formData.partnerId,
          speed: formData.speed,
          status: 'pending_weight',
          weight_kg: null,
          price_gross_cents: 0,
        })
        .select()
        .single();

      if (error) throw error;

      alert('✅ Commande créée !\n\nDéposez votre linge au pressing. Vous serez notifié après la pesée pour payer.');
      navigate('/client-dashboard');
    } catch (error: any) {
      console.error('Erreur:', error);
      alert('Erreur: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate('/client-dashboard')}
          className="flex items-center gap-2 text-white/60 hover:text-white mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour
        </button>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <Package className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white mb-2">Nouvelle commande</h1>
            <p className="text-white/60">Choisissez votre laverie et formule</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Étape 1: Choix laverie */}
            <div>
              <label className="block text-white/80 font-semibold mb-3 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                1. Choisissez votre laverie
              </label>
              <select
                required
                value={formData.partnerId}
                onChange={(e) => setFormData({ ...formData, partnerId: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">-- Sélectionnez --</option>
                {partners.map((p) => (
                  <option key={p.id} value={p.id} className="bg-slate-800">
                    {p.name} - {p.city}
                  </option>
                ))}
              </select>
            </div>

            {/* Étape 2: Choix formule */}
            <div>
              <label className="block text-white/80 font-semibold mb-3 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                2. Choisissez votre formule
              </label>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { value: 'premium', label: 'Premium', time: '72-96h', price: '5€/kg', desc: 'Économique' },
                  { value: 'express', label: 'Express', time: '24h', price: '10€/kg', desc: 'Rapide', popular: true },
                  { value: 'ultra', label: 'Ultra Express', time: '6h', price: '15€/kg', desc: 'Urgent' },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, speed: option.value })}
                    className={`relative p-6 rounded-xl border-2 transition-all ${
                      formData.speed === option.value
                        ? 'border-purple-500 bg-purple-500/20'
                        : 'border-white/20 bg-white/5 hover:border-white/40'
                    }`}
                  >
                    {option.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-500 text-slate-900 text-xs font-bold px-3 py-1 rounded-full">
                        POPULAIRE
                      </div>
                    )}
                    <p className="text-white font-bold text-lg mb-1">{option.label}</p>
                    <p className="text-white/60 text-sm mb-2">{option.time}</p>
                    <p className="text-purple-300 font-bold text-xl mb-1">{option.price}</p>
                    <p className="text-white/50 text-xs">{option.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Notes optionnelles */}
            <div>
              <label className="block text-white/80 font-semibold mb-3">
                3. Notes (optionnel)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Instructions spéciales, vêtements délicats..."
                rows={3}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Info */}
            <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-300 flex-shrink-0 mt-0.5" />
                <div className="text-blue-200 text-sm">
                  <p className="font-semibold mb-1">Comment ça marche ?</p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Déposez votre linge à la laverie choisie</li>
                    <li>Le pressing pèse et vous notifie du prix exact</li>
                    <li>Vous payez en ligne de manière sécurisée</li>
                    <li>Récupérez votre linge propre et plié !</li>
                  </ol>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !formData.partnerId}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Création...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Créer ma commande
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
