import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Package, Clock, Euro, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';

interface Partner {
  id: string;
  name: string;
  address: string;
  city: string;
  price_per_kg: number;
}

export default function NewOrder() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [partner, setPartner] = useState<Partner | null>(null);
  const [weight, setWeight] = useState<number>(5);
  const [serviceType, setServiceType] = useState<'premium' | 'express' | 'ultra_express'>('express');

  const servicePrices = {
    premium: 5,
    express: 10,
    ultra_express: 15,
  };

  const serviceLabels = {
    premium: 'Premium (72-96h)',
    express: 'Express (24h)',
    ultra_express: 'Ultra Express (6h)',
  };

  useEffect(() => {
    checkAuth();
    loadPartner();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/login', { state: { from: '/new-order' } });
      return;
    }
    setUser(session.user);
  };

  const loadPartner = async () => {
    const state = location.state as any;
    if (state?.selectedPartner) {
      setPartner(state.selectedPartner);
    } else if (state?.partnerId) {
      const { data } = await supabase
        .from('partners')
        .select('*')
        .eq('id', state.partnerId)
        .single();
      if (data) setPartner(data);
    }
  };

  const calculateTotal = () => {
    return weight * servicePrices[serviceType];
  };

  const handleCreateOrder = async () => {
    if (!user || !partner) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          partner_id: partner.id,
          weight_kg: weight,
          service_type: serviceType,
          price_per_kg: servicePrices[serviceType],
          total_amount: calculateTotal(),
          status: 'pending',
          pickup_date: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Commande créée avec succès !');
      navigate('/client-dashboard');
    } catch (error: any) {
      console.error('Erreur création commande:', error);
      toast.error('Erreur lors de la création de la commande');
    } finally {
      setLoading(false);
    }
  };

  if (!partner) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-8 transition font-semibold"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour
        </button>

        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
          <h1 className="text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-8">
            Nouvelle commande
          </h1>

          {/* Pressing sélectionné */}
          <div className="bg-purple-50 rounded-2xl p-6 mb-8 border-2 border-purple-200">
            <h2 className="font-bold text-xl text-slate-900 mb-2">{partner.name}</h2>
            <p className="text-slate-600">{partner.address}, {partner.city}</p>
          </div>

          {/* Poids */}
          <div className="mb-8">
            <label className="block text-lg font-bold text-slate-900 mb-4">
              <Package className="w-5 h-5 inline mr-2" />
              Poids estimé (kg)
            </label>
            <input
              type="number"
              min="1"
              max="50"
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="w-full px-6 py-4 text-2xl font-bold text-center border-3 border-purple-300 rounded-2xl focus:border-purple-600 focus:outline-none"
            />
            <p className="text-sm text-slate-500 mt-2">
              Le poids exact sera confirmé par le pressing lors du dépôt
            </p>
          </div>

          {/* Type de service */}
          <div className="mb-8">
            <label className="block text-lg font-bold text-slate-900 mb-4">
              <Clock className="w-5 h-5 inline mr-2" />
              Formule
            </label>
            <div className="grid md:grid-cols-3 gap-4">
              {(Object.keys(servicePrices) as Array<keyof typeof servicePrices>).map((type) => (
                <button
                  key={type}
                  onClick={() => setServiceType(type)}
                  className={`p-6 rounded-2xl border-3 transition-all ${
                    serviceType === type
                      ? 'border-purple-600 bg-purple-50 shadow-lg'
                      : 'border-slate-200 hover:border-purple-300'
                  }`}
                >
                  <div className="text-3xl font-black text-purple-600 mb-2">
                    {servicePrices[type]}€/kg
                  </div>
                  <div className="font-bold text-slate-900 mb-1">
                    {serviceLabels[type]}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Récapitulatif */}
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6 mb-8">
            <h3 className="font-bold text-xl text-slate-900 mb-4">
              <Euro className="w-5 h-5 inline mr-2" />
              Récapitulatif
            </h3>
            <div className="space-y-3 text-slate-700">
              <div className="flex justify-between">
                <span>Poids :</span>
                <span className="font-bold">{weight} kg</span>
              </div>
              <div className="flex justify-between">
                <span>Prix au kg :</span>
                <span className="font-bold">{servicePrices[serviceType]}€</span>
              </div>
              <div className="flex justify-between">
                <span>Formule :</span>
                <span className="font-bold">{serviceLabels[serviceType]}</span>
              </div>
              <div className="border-t-2 border-purple-300 pt-3 flex justify-between text-2xl font-black text-purple-900">
                <span>Total :</span>
                <span>{calculateTotal()}€</span>
              </div>
            </div>
          </div>

          {/* Bouton validation */}
          <button
            onClick={handleCreateOrder}
            disabled={loading}
            className="w-full py-5 rounded-2xl font-bold text-xl text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-2xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                Création en cours...
              </>
            ) : (
              <>
                <CreditCard className="w-6 h-6" />
                Confirmer la commande
              </>
            )}
          </button>

          <p className="text-sm text-slate-500 text-center mt-4">
            Le paiement sera effectué lors du dépôt au pressing
          </p>
        </div>
      </div>
    </div>
  );
}
