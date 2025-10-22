import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useOrders } from '@/hooks/useOrders';
import { supabase } from '@/lib/supabase';
import { Partner } from '@/types/database';
import { MapPin, Package, Clock, TrendingUp, Zap, ArrowLeft, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';

export function NewOrder() {
  const { user } = useAuth();
  const { createOrder } = useOrders(user?.id);
  const navigate = useNavigate();

  const [partners, setPartners] = useState<Partner[]>([]);
  const [selectedPartner, setSelectedPartner] = useState<string>('');
  const [serviceType, setServiceType] = useState<'standard' | 'express' | 'ultra'>('standard');
  const [weight, setWeight] = useState<number>(1);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .order('name');

      if (error) throw error;
      setPartners(data || []);
    } catch (error) {
      console.error('Error fetching partners:', error);
      toast.error('Erreur lors du chargement des partenaires');
    }
  };

  const prices = {
    standard: 5,
    express: 10,
    ultra: 15,
  };

  const totalPrice = weight * prices[serviceType];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPartner) {
      toast.error('Veuillez sélectionner un point relais');
      return;
    }

    setLoading(true);

    try {
      // 1. Créer la commande
      const order = await createOrder({
        partner_id: selectedPartner,
        service_type: serviceType,
        weight,
        notes: notes || undefined,
      });

      // 2. Créer la session Stripe Checkout
      const { data: { url }, error } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          serviceType,
          weight,
          orderId: order.id,
        },
      });

      if (error) throw error;

      // 3. Rediriger vers Stripe Checkout
      if (url) {
        window.location.href = url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error: any) {
      console.error('Order creation error:', error);
      toast.error('Erreur lors de la création de la commande');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour au dashboard
        </button>

        <h1 className="text-4xl font-bold text-white mb-8">Nouvelle commande</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Sélection du partenaire */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <MapPin className="w-6 h-6 text-purple-400" />
              Point relais
            </h2>
            <select
              value={selectedPartner}
              onChange={(e) => setSelectedPartner(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Choisissez un point relais</option>
              {partners.map((partner) => (
                <option key={partner.id} value={partner.id}>
                  {partner.name} - {partner.city} ({partner.postal_code})
                </option>
              ))}
            </select>
          </div>

          {/* Type de service */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Package className="w-6 h-6 text-purple-400" />
              Formule
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => setServiceType('standard')}
                className={`p-4 rounded-xl border-2 transition ${
                  serviceType === 'standard'
                    ? 'border-purple-500 bg-purple-500/20'
                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                }`}
              >
                <Clock className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <h3 className="text-lg font-bold text-white mb-1">Premium</h3>
                <p className="text-gray-400 text-sm mb-2">72-96h</p>
                <div className="text-2xl font-bold text-white">5€/kg</div>
              </button>

              <button
                type="button"
                onClick={() => setServiceType('express')}
                className={`p-4 rounded-xl border-2 transition ${
                  serviceType === 'express'
                    ? 'border-blue-500 bg-blue-500/20'
                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                }`}
              >
                <TrendingUp className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <h3 className="text-lg font-bold text-white mb-1">Express</h3>
                <p className="text-gray-400 text-sm mb-2">24h</p>
                <div className="text-2xl font-bold text-white">10€/kg</div>
              </button>

              <button
                type="button"
                onClick={() => setServiceType('ultra')}
                className={`p-4 rounded-xl border-2 transition ${
                  serviceType === 'ultra'
                    ? 'border-red-500 bg-red-500/20'
                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                }`}
              >
                <Zap className="w-8 h-8 text-red-400 mx-auto mb-2" />
                <h3 className="text-lg font-bold text-white mb-1">Ultra Express</h3>
                <p className="text-gray-400 text-sm mb-2">6h</p>
                <div className="text-2xl font-bold text-white">15€/kg</div>
              </button>
            </div>
          </div>

          {/* Poids */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Poids du linge</h2>
            <div className="flex items-center gap-4">
              <input
                type="number"
                min="0.5"
                step="0.5"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                required
                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <span className="text-2xl font-bold text-white">kg</span>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Notes (optionnel)</h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder="Instructions particulières..."
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Total */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 mb-1">Total à payer</p>
                <p className="text-sm text-white/60">{weight} kg × {prices[serviceType]}€</p>
              </div>
              <div className="text-5xl font-bold text-white">{totalPrice}€</div>
            </div>
          </div>

          {/* Submit avec Stripe */}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {loading ? (
              'Redirection vers le paiement...'
            ) : (
              <>
                <CreditCard className="w-6 h-6" />
                Payer avec Stripe
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}